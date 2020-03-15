import requests

VERIFY_URL = 'https://rest.akismet.com/1.1/verify-key'
CHECK_URL = 'https://%s.rest.akismet.com/1.1/comment-check'

def verify_key(key: str, blog: str) -> bool:
    data = {
        'key': key,
        'blog': blog
    }
    res = requests.post(VERIFY_URL, data)
    if res.text == 'valid':
        return True
    return False

def init(key: str, blog: str) -> bool:
    global CHECK_URL
    if not verify_key(key, blog):
        return False
    CHECK_URL = CHECK_URL % key
    return True

def check(blog, user_ip, user_agent, permalink, comment_content, comment_author, comment_author_email, comment_author_url):
    data = {
        'blog': blog,
        'user_ip': user_ip,
        'user_agent': user_agent,
        'permalink': permalink,
        'comment_content': comment_content,
        'comment_author': comment_author,
        'comment_author_email': comment_author_email,
        'comment_author_url': comment_author_url,
        'comment_type': 'comment',
        'blog_lang': 'cn,zh'
    }
    res = requests.post(CHECK_URL, data)
    if res.text.lower() == 'true':
        return True
    return False
