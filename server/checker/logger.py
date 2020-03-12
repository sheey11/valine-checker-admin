from datetime import datetime
import os.path, os

colour_sign = {
    'warning': '\033[1;33m',
    'error': '\033[1;32m',
    'info': '\033[0m',
}
log_file = None

def init():
    global log_file
    if not os.path.exists('logs'):
        os.mkdir('logs')
    fname = './logs/valine-checker-%s.log' % datetime.now().strftime('%Y-%m-%d')
    log_file = open(fname, 'a+')

def logging(msg, level='info', prnt = False):
    fname = 'valine-checker-%s.log' % datetime.now().strftime('%Y-%m-%d')
    if log_file == None or log_file.name != fname:
        init()
    log = '[%s][%s]\t%s' % (datetime.now().strftime('%Y-%m-%d %H:%M:%S'), level.upper(), msg)
    log_file.write(log + '\n')
    if prnt:
        print(colour_sign[level.lower()] + log + colour_sign['info'])