Here my simple blog, have fun


## Chat

Add prometheus metrics comapre with old one

https://youtu.be/5J1knrjJHGw
Frontend Side

- [x] create vue component
- [x] migrate logic to the vue
- [x] scroll to the end of chat when new message was created
- [x] system messages
- [x] sidebar panel with select of status of an issue
- [x] add skeletons for messages
- [x] create vue abstraction for action cable
- [x] file upload form layout
- [x] file upload form
- [x] rendering files
- [x] upload files to backend 
- [x] broadcasting new files to sidebar 
- [x] broadcasting the state of product to chat 
- [x] sidebar panel with files
- [x] save the ability to others use the action cable consumer outside of a vue app
- [x] hide chat on frontend side on hidden url
- [x] autofocus on input when chat mounted
- [x] clear files after submitting (dont resend them in a next message)
- [x] delete roles.js
- [x] prevent xss 
- [x] after submitting big message collapse textarea
- [x] rewrite autofocus on vue logic
- [x] after submitting form autofocus text area once more
- [x] add scroll on the enter submit 
- [x] add some help note that user can submit on CMD + enter
- [x] rewrite old data-selector="messages-chat-comment" expanding chat logic on vue
- [x] delete const oldNode = queryDataSelector('messages-chat'); const newNode = queryDataSelector('vue-messages-chat'); in channel
- [x] delete all unsued templates
- [] need ui ux feature where we can see notifications (not in tab counter) something more similar to facebook
- [] optimistic submitting message dont wait mvc loop 
- [] notifiations should work as watsapp messnger
- [] donwload only part of messages 
- [] delete messages-chat-documents-list
- [] check flashes in [./app/views/profile/new_messages](app/views/profile/new_messages)
- [] add prop types for components
- [] delete notification cahnnel
- [] make a reusable component

Backend
- [x] webscokets
- [x] user typing...
- [x] add a tests
- [x] smart notification that not spam to the email, throtling or debouncing
- [x] tests for smart notifications 
- [x] sending files
- [x] markdown support
- [x] delete and refactor /Users/andreyfrolov/Documents/abconsult/debthole/app/serializers/channels/message_serializer.rb
- [] delete mess in controllers
- [] https://git.debtfair.ru/SShekotihin/debthole/-/issues/334
- [] add metrics
- [] add serialization for all broadcast to
- [] icon with amount of messages like in a facebook updating in realtime
- [] also say to the user that we can send message with combination of keys
- [] sidebar panel with files
- [] Service object для того чтобы обрабатывать создание и бродкаст Message не только в контролере


Handling the errors
Frontend 
- [x] if message empty
- [x] handle the case when no messages in a chat
- [x] if files are empty
- [ ] handle case when messages are loaded from a server

Backend

- [x] if message empty
- [x] if files are empty
- [] and 404 when something went wrong




```sh
  Issue.find(68).messages.each(&:destroy!)
```