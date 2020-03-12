import leancloud as lc
import json

config = {}
query = None

def load_config():
    global config
    with open('server/checker/config.json', 'r') as f:
        config = json.loads(f.read())

def init():
    global query
    load_config()
    lc.init(config['app_id'], master_key=config['master_key'])
    query = lc.Query('Comment')

def main():
    init()
    comments = query.find()
    data = {"site_name": config['site_name'] ,"comments" : []}
    for comment in comments:
        c = {}
        c['sender'] = comment.get('nick')
        c['mail'] = comment.get('mail')
        c['time'] = comment.created_at.strftime('%Y-%m-%d %H:%M:%S')
        spam = comment.get('isSpam')
        if spam == None:
            spam = False
        c['isSpam'] = spam
        c['url'] = config['site_url'] + comment.get('url') + '#' + comment.id
        c['id'] = comment.id
        data["comments"].append(c)
    print(json.dumps(data))

if __name__ == '__main__':
    main()