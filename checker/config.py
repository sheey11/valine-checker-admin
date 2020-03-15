import os

CONFIG_VARIABLES = [
    'app_id',
    'master_key',
    'interval',
    'site_name',
    'site_url',
    'smtp_user',
    'smtp_mail',
    'smtp_password',
    'smtp_host',
    'smtp_port',
    'smtp_secure',
    'blogger_mail',
    'sender_name',
    'email_subject',
    'mail_template',
    'mail_template_admin',
    'akismet_key',
]

def load_config() -> dict:
    config = {}
    for variable in CONFIG_VARIABLES:
        value = os.environ[variable.upper()]
        config[variable] = value
    config['interval'] = int(config['interval'])
    config['smtp_port'] = int(config['smtp_port'])
    config['smtp_secure'] = True if config['smtp_secure'].lower() == 'true' else False
    config['blogger_mail'] = config['blogger_mail'].replace(' ', '').split(',')
    return config
