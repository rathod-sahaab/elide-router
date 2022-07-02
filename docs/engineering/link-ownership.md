# Who owns the link

Links can be of 4 types

1. Links owned by single user.
2. Links part of a project, project is owned by single user.
3. Links owned by organisation.
4. Links part of a project, project is owned by organisation.

A simple schema to achieve this would be

```sql
CREATE TABLE "Link" (
  -- ... other properties
  "creatorId" INTEGER NOT NULL,
  "projectId" INTEGER,
  "organisationId" INTEGER,
);
```

We always want to know who created the link so `creatorId` is required, but the link will not always be part of a project or an organisation so they are optional.

This Schema and listed 4 types of links make most of the design obvious but an implementation of 4th point requires approach to be stated explicitly.

Consider a link which is in a project owned by an organisation, in that case only projectId will be populated and organisationId will be null this is to avoid anomalies that arise due to redundancy introduced. The `Project` schema also has an `organisationId` field and `organisationId` of Link has to be kept in sync with that of projects, if organisationId of project changes, or Link is transfered to another project those have to be synced causing complexity at best and increased probability bugs for worse.
