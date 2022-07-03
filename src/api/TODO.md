-  api
   -  auth
      -  [x] login
      -  [x] register
      -  [x] logout
      -  [] fogot-password
   -  user
      -  [] profile
      -  [] change-password
      -  [] DELETE /sessions
      -  [] DELETE /sessions/{sessionId}
   -  link
      -  [] /
         -  [x] /
      -  [x] POST /
      -  [] /{linkId}
   -  project
      -  [] /
      -  [] /{id}/links
      -  [] POST /
   -  organisations
      -  [] /
      -  [] /{id}
      -  [] /{id}/links
      -  [] /{id}/projects
      -  [] POST /

## Improvements

1. Store user agents in session to give better idea to user about session
