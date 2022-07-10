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
      -  [x] GET /invitations -- All of user invitations
      -  [x] DELETE /invitations/{id} -- reject
      -  [x] PUT /invitations/{id} -- accept
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
      -  [x] /
      -  [] /{id}
      -  [x] /{id}/links
      -  [x] /{id}/projects
      -  [x] POST /
      -  [x] POST /{id}/invite
      -  [x] DELETE /{id}/member/{userId}
      -  [x] GET /invitations
      -  [x] DELETE /invitations/{id} -- cancel

## Improvements

1. Store user agents in session to give better idea to user about session
