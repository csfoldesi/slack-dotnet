/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as IndexImport } from "./routes/index"
import { Route as WorkspacesIndexImport } from "./routes/workspaces_/index"
import { Route as AuthIndexImport } from "./routes/auth/index"
import { Route as JoinWorkspaceIdImport } from "./routes/join_/$workspaceId"
import { Route as AuthCallbackImport } from "./routes/auth/callback"
import { Route as WorkspacesWorkspaceIdIndexImport } from "./routes/workspaces_/$workspaceId/index"
import { Route as WorkspacesWorkspaceIdMembersMemberIdIndexImport } from "./routes/workspaces_/$workspaceId/members_/$memberId/index"
import { Route as WorkspacesWorkspaceIdChannelsChannelIdIndexImport } from "./routes/workspaces_/$workspaceId/channels_/$channelId/index"

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const WorkspacesIndexRoute = WorkspacesIndexImport.update({
  id: "/workspaces_/",
  path: "/workspaces/",
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  id: "/auth/",
  path: "/auth/",
  getParentRoute: () => rootRoute,
} as any)

const JoinWorkspaceIdRoute = JoinWorkspaceIdImport.update({
  id: "/join_/$workspaceId",
  path: "/join/$workspaceId",
  getParentRoute: () => rootRoute,
} as any)

const AuthCallbackRoute = AuthCallbackImport.update({
  id: "/auth/callback",
  path: "/auth/callback",
  getParentRoute: () => rootRoute,
} as any)

const WorkspacesWorkspaceIdIndexRoute = WorkspacesWorkspaceIdIndexImport.update(
  {
    id: "/workspaces_/$workspaceId/",
    path: "/workspaces/$workspaceId/",
    getParentRoute: () => rootRoute,
  } as any,
)

const WorkspacesWorkspaceIdMembersMemberIdIndexRoute =
  WorkspacesWorkspaceIdMembersMemberIdIndexImport.update({
    id: "/workspaces_/$workspaceId/members_/$memberId/",
    path: "/workspaces/$workspaceId/members/$memberId/",
    getParentRoute: () => rootRoute,
  } as any)

const WorkspacesWorkspaceIdChannelsChannelIdIndexRoute =
  WorkspacesWorkspaceIdChannelsChannelIdIndexImport.update({
    id: "/workspaces_/$workspaceId/channels_/$channelId/",
    path: "/workspaces/$workspaceId/channels/$channelId/",
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/auth/callback": {
      id: "/auth/callback"
      path: "/auth/callback"
      fullPath: "/auth/callback"
      preLoaderRoute: typeof AuthCallbackImport
      parentRoute: typeof rootRoute
    }
    "/join_/$workspaceId": {
      id: "/join_/$workspaceId"
      path: "/join/$workspaceId"
      fullPath: "/join/$workspaceId"
      preLoaderRoute: typeof JoinWorkspaceIdImport
      parentRoute: typeof rootRoute
    }
    "/auth/": {
      id: "/auth/"
      path: "/auth"
      fullPath: "/auth"
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof rootRoute
    }
    "/workspaces_/": {
      id: "/workspaces_/"
      path: "/workspaces"
      fullPath: "/workspaces"
      preLoaderRoute: typeof WorkspacesIndexImport
      parentRoute: typeof rootRoute
    }
    "/workspaces_/$workspaceId/": {
      id: "/workspaces_/$workspaceId/"
      path: "/workspaces/$workspaceId"
      fullPath: "/workspaces/$workspaceId"
      preLoaderRoute: typeof WorkspacesWorkspaceIdIndexImport
      parentRoute: typeof rootRoute
    }
    "/workspaces_/$workspaceId/channels_/$channelId/": {
      id: "/workspaces_/$workspaceId/channels_/$channelId/"
      path: "/workspaces/$workspaceId/channels/$channelId"
      fullPath: "/workspaces/$workspaceId/channels/$channelId"
      preLoaderRoute: typeof WorkspacesWorkspaceIdChannelsChannelIdIndexImport
      parentRoute: typeof rootRoute
    }
    "/workspaces_/$workspaceId/members_/$memberId/": {
      id: "/workspaces_/$workspaceId/members_/$memberId/"
      path: "/workspaces/$workspaceId/members/$memberId"
      fullPath: "/workspaces/$workspaceId/members/$memberId"
      preLoaderRoute: typeof WorkspacesWorkspaceIdMembersMemberIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute
  "/auth/callback": typeof AuthCallbackRoute
  "/join/$workspaceId": typeof JoinWorkspaceIdRoute
  "/auth": typeof AuthIndexRoute
  "/workspaces": typeof WorkspacesIndexRoute
  "/workspaces/$workspaceId": typeof WorkspacesWorkspaceIdIndexRoute
  "/workspaces/$workspaceId/channels/$channelId": typeof WorkspacesWorkspaceIdChannelsChannelIdIndexRoute
  "/workspaces/$workspaceId/members/$memberId": typeof WorkspacesWorkspaceIdMembersMemberIdIndexRoute
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute
  "/auth/callback": typeof AuthCallbackRoute
  "/join/$workspaceId": typeof JoinWorkspaceIdRoute
  "/auth": typeof AuthIndexRoute
  "/workspaces": typeof WorkspacesIndexRoute
  "/workspaces/$workspaceId": typeof WorkspacesWorkspaceIdIndexRoute
  "/workspaces/$workspaceId/channels/$channelId": typeof WorkspacesWorkspaceIdChannelsChannelIdIndexRoute
  "/workspaces/$workspaceId/members/$memberId": typeof WorkspacesWorkspaceIdMembersMemberIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/": typeof IndexRoute
  "/auth/callback": typeof AuthCallbackRoute
  "/join_/$workspaceId": typeof JoinWorkspaceIdRoute
  "/auth/": typeof AuthIndexRoute
  "/workspaces_/": typeof WorkspacesIndexRoute
  "/workspaces_/$workspaceId/": typeof WorkspacesWorkspaceIdIndexRoute
  "/workspaces_/$workspaceId/channels_/$channelId/": typeof WorkspacesWorkspaceIdChannelsChannelIdIndexRoute
  "/workspaces_/$workspaceId/members_/$memberId/": typeof WorkspacesWorkspaceIdMembersMemberIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | "/"
    | "/auth/callback"
    | "/join/$workspaceId"
    | "/auth"
    | "/workspaces"
    | "/workspaces/$workspaceId"
    | "/workspaces/$workspaceId/channels/$channelId"
    | "/workspaces/$workspaceId/members/$memberId"
  fileRoutesByTo: FileRoutesByTo
  to:
    | "/"
    | "/auth/callback"
    | "/join/$workspaceId"
    | "/auth"
    | "/workspaces"
    | "/workspaces/$workspaceId"
    | "/workspaces/$workspaceId/channels/$channelId"
    | "/workspaces/$workspaceId/members/$memberId"
  id:
    | "__root__"
    | "/"
    | "/auth/callback"
    | "/join_/$workspaceId"
    | "/auth/"
    | "/workspaces_/"
    | "/workspaces_/$workspaceId/"
    | "/workspaces_/$workspaceId/channels_/$channelId/"
    | "/workspaces_/$workspaceId/members_/$memberId/"
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthCallbackRoute: typeof AuthCallbackRoute
  JoinWorkspaceIdRoute: typeof JoinWorkspaceIdRoute
  AuthIndexRoute: typeof AuthIndexRoute
  WorkspacesIndexRoute: typeof WorkspacesIndexRoute
  WorkspacesWorkspaceIdIndexRoute: typeof WorkspacesWorkspaceIdIndexRoute
  WorkspacesWorkspaceIdChannelsChannelIdIndexRoute: typeof WorkspacesWorkspaceIdChannelsChannelIdIndexRoute
  WorkspacesWorkspaceIdMembersMemberIdIndexRoute: typeof WorkspacesWorkspaceIdMembersMemberIdIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthCallbackRoute: AuthCallbackRoute,
  JoinWorkspaceIdRoute: JoinWorkspaceIdRoute,
  AuthIndexRoute: AuthIndexRoute,
  WorkspacesIndexRoute: WorkspacesIndexRoute,
  WorkspacesWorkspaceIdIndexRoute: WorkspacesWorkspaceIdIndexRoute,
  WorkspacesWorkspaceIdChannelsChannelIdIndexRoute:
    WorkspacesWorkspaceIdChannelsChannelIdIndexRoute,
  WorkspacesWorkspaceIdMembersMemberIdIndexRoute:
    WorkspacesWorkspaceIdMembersMemberIdIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth/callback",
        "/join_/$workspaceId",
        "/auth/",
        "/workspaces_/",
        "/workspaces_/$workspaceId/",
        "/workspaces_/$workspaceId/channels_/$channelId/",
        "/workspaces_/$workspaceId/members_/$memberId/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/auth/callback": {
      "filePath": "auth/callback.tsx"
    },
    "/join_/$workspaceId": {
      "filePath": "join_/$workspaceId.tsx"
    },
    "/auth/": {
      "filePath": "auth/index.tsx"
    },
    "/workspaces_/": {
      "filePath": "workspaces_/index.tsx"
    },
    "/workspaces_/$workspaceId/": {
      "filePath": "workspaces_/$workspaceId/index.tsx"
    },
    "/workspaces_/$workspaceId/channels_/$channelId/": {
      "filePath": "workspaces_/$workspaceId/channels_/$channelId/index.tsx"
    },
    "/workspaces_/$workspaceId/members_/$memberId/": {
      "filePath": "workspaces_/$workspaceId/members_/$memberId/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
