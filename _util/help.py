#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os
import json
import collections
import copy
import pystache

filedir = os.path.dirname(__file__)
schemaJson = open(os.path.join(filedir, '../_templates/schemas.json')).read()
schemas = json.loads(schemaJson, object_pairs_hook=collections.OrderedDict)
save_dirs = {
    'blog': os.path.join(filedir, '../_drafts/'),
    'art': os.path.join(filedir, '../_art/'),
    'projects': os.path.join(filedir, '../_projects/')
}

def prompt(title, obj):
    """Prompt for input

    :obj: TODO
    :returns: TODO

    """
    for key in obj:
        if type(obj[key]) is list:
            while True:
                if input('Finished? (y/N)') == 'y':
                    break
                obj[key].append(prompt('{} > {}'.format(title, key), copy.deepcopy(obj[key][0])))
            obj[key] = obj[key][1:] if len(obj[key]) >= 2 else None
        else:
            message = '{} > {}: '.format(title, key) if obj[key] == '' else '{} > {}({}): '.format(title, key, obj[key])
            val = input(message)
            if val != '':
                obj[key] = val
    return obj

if len(sys.argv) < 2:
    print('Specify a subcommand')
elif sys.argv[1] == 'new':
    if len(sys.argv) < 3:
        print('Specify a post type')
    elif sys.argv[2] in schemas:
        schema = schemas[sys.argv[2]]
        template = open(os.path.join(filedir, '../_templates/{}.mustache'.format(sys.argv[2]))).read()

        obj = prompt(sys.argv[2], schema)

        final = open(save_dirs[sys.argv[2]] + obj.title.lower().replace(' ', '-') + '.md', 'w')
        final.write(pystache.render(template, obj))
    else:
        print('No such schema')
        sys.exit()
elif sys.argv[1] == 'publish':
    pass
else:
    print('No such subcommand')

sys.exit()