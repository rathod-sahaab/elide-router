# TODO

-  [x] GET /:slug
-  api
   -  [ ] /csrf
   -  auth
      -  [x] login
      -  [x] register
      -  [x] logout
      -  [x] /refresh
      -  [x] GET /sessions
      -  [x] DELETE /sessions
      -  [x] DELETE /sessions/{sessionId}
      -  [] forgot-password
   -  user
      -  [x] profile
      -  [x] change-password
      -  [x] GET /invitations -- All of user invitations
      -  [x] DELETE /invitations/{id} -- reject
      -  [x] PUT /invitations/{id} -- accept
   -  link
      -  [x] /
      -  [x] GET /{slug}/availability
      -  [x] POST /
      -  [x] DELTE /{linkId}
      -  [] /{linkId}
   -  project
      -  [x] /
      -  [x] /{id}/links
      -  [x] POST /
      -  [] DELETE /{id}
   -  organisations
      -  [x] /
      -  [x] /{id}
      -  [x] /{id}/links
      -  [x] /{id}/projects
      -  [x] POST /
      -  [x] POST /{id}/invite
      -  [x] /{id}/members
      -  [x] DELETE /{id}/member/{userId}
      -  [x] GET /invitations
      -  [x] DELETE /invitations/{id} -- cancel

## Improvements

1. Store user agents in session to give better idea to user about session
