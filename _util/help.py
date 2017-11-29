#!/usr/bin/env python
# -*- coding: utf-8 -*-
from pybars import Compiler

import sys
import os
import json
import collections
import copy
import datetime

compiler = Compiler()

filedir = os.path.dirname(__file__)
schemaJson = open(os.path.join(filedir, '../_templates/schemas.json')).read()
schemas = json.loads(schemaJson, object_pairs_hook=collections.OrderedDict)
save_dirs = {
    'blog': os.path.join(filedir, '../_drafts/'),
    'art': os.path.join(filedir, '../_art/'),
    'project': os.path.join(filedir, '../_projects/'),
}

def prompt(title, obj):
    """Prompt for input

    :obj: TODO
    :returns: TODO

    """
    for key in obj:
        if type(obj[key]) is list:
            if input('Would you like to add a {}? (y/N)'.format(key)) == 'y':
                while True:
                    obj[key].append(prompt('{} > {}'.format(title, key), copy.deepcopy(obj[key][0])))
                    if input('Finished? (y/N)') == 'y':
                        break
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
        template = compiler.compile(template)

        obj = prompt(sys.argv[2], schema)

        final = open(save_dirs[sys.argv[2]] + obj.get('title').replace(' ', '-') + '.md', 'w')
        final.write(template(obj))
    else:
        print('No such schema')
        sys.exit()
elif sys.argv[1] == 'publish':
    if len(sys.argv) < 3:
        print('Specify a file')
        files = os.listdir(os.path.join(filedir, '../_drafts/'))
        files = [f for f in files if not f.startswith('.')]
        for ind, f in enumerate(files):
            print('{}) {}'.format(ind + 1, f))
        ind = input("Which file: ")
        ind = int(ind)
        draft = files[ind - 1]
    else:
        draft = sys.argv[2]
    today = datetime.date.today()
    postname = '{}-{}'.format(str(today), draft)
    draftpath = os.path.join(filedir, '../_drafts', draft)
    postpath = os.path.join(filedir, '../_posts', postname)
    os.rename(draftpath, postpath)
else:
    print('No such subcommand')

sys.exit()
