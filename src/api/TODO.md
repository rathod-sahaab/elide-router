-  api
   -  auth
      -  [x] login
      -  [x] register
      -  [x] logout
      -  [] forgot-password
   -  user
      -  [x] profile
      -  [x] change-password
      -  [x] DELETE /sessions
      -  [x] DELETE /sessions/{sessionId}
   -  link
      -  [x] /
      -  [x] POST /
      -  [] /{linkId}
      -  [x] DELTE /{linkId}
   -  project
      -  [x] /
      -  [x] /{id}/links
      -  [x] POST /
   -  organisations
      -  [] /
      -  [] /{id}
      -  [] /{id}/links
      -  [] /{id}/projects
      -  [] POST /

## Improvements

1. Store user agents in session to give better idea to user about session
