import pystache

template = open('_templates/project.mustache').read()

title = input('Post Title: ')
thumb = input('Thumbnail File: ')
desc = input('Description: ')

tech = []

while True:
    technology = input('Technologies (q to finish): ')
    if technology == 'q':
        break
    tech.append({'name': technology})

final = open('_projects/' + title.lower().replace(' ', '-'), 'w')

obj = {
    'title': title,
    'thumb': thumb,
    'desc': desc,
    'tech': tech
}

final.write(pystache.render(template, obj))
