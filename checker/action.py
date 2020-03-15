import leancloud as lc
import json, sys
from config import load_config

config = {}
query = None

# def load_config():
#     global config
#     with open('server/checker/config.json', 'r') as f:
#         config = json.loads(f.read())

def init():
    global query, config
    config = load_config()
    lc.init(config['app_id'], master_key=config['master_key'])
    query = lc.Query('Comment')

def delete_comment(obj_id,):
    try:
        c = query.get(obj_id)
        c.destroy()
        return True, '成功！'
    except Exception as e:
        return False, str(e)

def mark_comment(obj_id, mark_spam=False, hide=True):
    try:
        c = query.get(obj_id)
        if mark_spam:
            c.set('isSpam', True)
        else:
            c.set('isSpam', False)
        acl = lc.ACL()
        acl.set_public_read_access(not hide)
        c.set_acl(acl)
        c.save()
        return True, '成功！'
    except Exception as e:
        return False, str(e)

def main(argv):
    init()
    obj_id = argv[1]

    ret = False
    msg = 'wrong arg'

    if argv[0] == 'delete':
        ret, msg = delete_comment(obj_id)
    elif argv[0] == 'hide':
        ret, msg = mark_comment(obj_id)
    elif argv[0] == 'markspam':
        ret, msg = mark_comment(obj_id, True)
    elif argv[0] == 'marknormal':
        ret, msg = mark_comment(obj_id, False, False)
    print(json.dumps({
        "code": 200 if ret else -1,
        "msg": msg
    }))

if __name__ == '__main__':
    main(sys.argv[1:])

