import leancloud as lc
import json, time, threading, smtplib, asyncio, traceback, threading
from smtplib import SMTPHeloError, SMTPAuthenticationError
from email.mime.text import MIMEText
from email.utils import formataddr
from logger import logging
from config import load_config
import akismet

config = {}
query = None
server = None
user = None
akismet_enabled = False
timer = None

def check_new_comments() -> list:
    query.not_equal_to('isNotified', True)
    query.not_equal_to('isSpam', True)
    unnotified_list = query.find()
    logging('检查新评论，查询到 %d 个新评论。' % len(unnotified_list), prnt = True)
    return unnotified_list

def login_to_smtp() -> str:
    global server
    try:
        if config['smtp_secure']:
            server = smtplib.SMTP_SSL(config['smtp_host'], config['smtp_port'])
        else:
            server = smtplib.SMTP(config['smtp_host'], config['smtp_port'])
    except:
        return "无法连接到服务器，请检查设置"
    # server.set_debuglevel(1)
    try:
        server.login(config['smtp_user'], config['smtp_password'])
    except SMTPHeloError:
        return "无法连接到服务器，请检查设置"
    except SMTPAuthenticationError:
        return "用户名或密码错误，无法登陆 SMTP 服务器"
    return ''

def send_email(content: str, frm: str, to: list, subject: str, sender_name: str, receiver_name: str = '') -> bool:
    msg = MIMEText(content, 'html', 'utf-8')
    msg['Subject'] = subject
    msg['From'] = formataddr([sender_name, frm])
    msg['To'] = ','.join([formataddr([receiver_name, t]) for t in to])
    try:
        server.sendmail(frm, to, msg.as_string())
        return True
    except:
        return False

def send_replay_email(comment) -> bool:
    parent_comment = query.get(comment.get('pid'))
    if(parent_comment.get('email') == None):
        return True
    mail_template = config['mail_template']
    mail_template = mail_template.replace('${SITE_NAME}', config['site_name'])
    mail_template = mail_template.replace('${SITE_URL}', config['site_url'])
    mail_template = mail_template.replace('${PARENT_NICK}', parent_comment.get('nick'))
    mail_template = mail_template.replace('${PARENT_COMMENT}', parent_comment.get('comment'))
    mail_template = mail_template.replace('${NICK}', comment.get('comment'))
    mail_template = mail_template.replace('${COMMENT}', comment.get('comment'))
    mail_template = mail_template.replace('${POST_URL}', config['site_url'] + comment.get('url') + '#' + comment.get('objectId'))
    subject = config['email_subject']
    subject = subject.replace('${PARENT_NICK}', parent_comment.get('nick'))
    subject = subject.replace('${SITE_NAME}', config['site_name'])
    return send_email(mail_template, config['smtp_mail'], comment.get['mail'], subject, config['sender_name'], comment.get('nick'))


def send_admin_email(comment) -> bool:
    mail_template = config['mail_template_admin']
    mail_template = mail_template.replace(r'${SITE_NAME}', config['site_name'])
    mail_template = mail_template.replace(r'${SITE_URL}', config['site_url'])
    mail_template = mail_template.replace(r'${NICK}', comment.get('nick'))
    mail_template = mail_template.replace(r'${COMMENT}', comment.get('comment'))
    mail_template = mail_template.replace(r'${POST_URL}', config['site_url'] + comment.get('url') + '#' + comment.get('objectId'))
    subject = config['site_name'] + '上有新评论了'
    return send_email(mail_template, config['smtp_mail'], config['blogger_mail'], subject, config['site_name'])

def prepare_smtp_server():
    logging('正在登陆 SMTP 服务器...', prnt = True)
    m = login_to_smtp()
    if m != '':
        logging(m, level = 'error', prnt = True)
        exit(1)

def send_emails(lst):
    if len(lst) == 0:
        return
    prepare_smtp_server()
    for c in lst:
        if akismet_enabled:
            logging('正在通过 akismet 验证垃圾评论: %s' % c.get('comment')[:-1]) # 最后一个字符是 \n
            if akismet.check(config['site_url'], c.get('ip'), c.get('ua'), config['site_url'] + c.get('url'), c.get('comment'), c.get('nick'), c.get('mail'), c.get('link')):
                logging('检测到垃圾评论，跳过发送邮件')
                acl = lc.ACL()
                acl.set_public_read_access(False)
                c.set_acl(acl)
                c.set('isSpam', True)
                c.save()
                continue
        if c.get('pid') == None:
            # notify the blogger
            func = send_admin_email
            logging('正在通知博主： objectId = %s' % c.id)
        else:
            # notify the author of the comment be replied
            func = send_replay_email
            logging('正在通知被回复者： objectId = %s' % c.id)
        if func(c):
            logging('邮件发送成功！')
            c.set('isNotified', True)
            c.save()
        else:
            logging('邮件发送失败！', level = 'error', prnt = True)
            exit(1)
    logging('登出 SMTP 服务器...', prnt = True)
    server.quit()

# def load_config():
#     global config
#     with open('config.json', 'r') as f:
#         config = json.loads(f.read())

def init():
    global query, user, akismet_enabled, config
    logging('加载配置文件...', prnt = True)
    config = load_config()
    lc.init(config['app_id'], master_key=config['master_key'])
    if 'akismet_key' in config and config['akismet_key'] != '':
        logging('验证 akismet key...', prnt = True)
        if not akismet.init(config['akismet_key'], config['site_url']):
            logging('akismet key 验证失败，请检查你的 akismet key', level='error', prnt = True)
            exit(1)
        akismet_enabled = True
    query = lc.Query('Comment')

def check():
    try:
        lst = check_new_comments()
        send_emails(lst)
        logging('等待 %d 秒...' % config['interval'])
    except Exception as e:
        logging('Error encountered:',level = 'error', prnt = True)
        for line in traceback.format_exc().split('\n'):
            logging(line, level = 'error', prnt = True)
        logging('重新登录 leancloud...', prnt = True)
        init()

async def main():
    logging('Valine-Cheker 开始初始化。', prnt = True)
    init()
    while True:
        check()
        await asyncio.sleep(config['interval'])

if __name__ == '__main__':
    asyncio.run(main())