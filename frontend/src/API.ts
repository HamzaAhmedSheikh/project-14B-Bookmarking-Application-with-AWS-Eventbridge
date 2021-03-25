/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type bookmarkCreateInput = {
  id: string,
  url: string,
  description: string,
};

export type Event = {
  __typename: "Event",
  result?: string | null,
};

export type bookmark = {
  __typename: "bookmark",
  id?: string,
  url?: string,
  description?: string,
};

export type CreateBookmarkMutationVariables = {
  newBookmark?: bookmarkCreateInput,
};

export type CreateBookmarkMutation = {
  createBookmark?:  {
    __typename: "Event",
    result?: string | null,
  } | null,
};

export type DeleteBookmarkMutationVariables = {
  id?: string,
};

export type DeleteBookmarkMutation = {
  deleteBookmark?:  {
    __typename: "Event",
    result?: string | null,
  } | null,
};

export type AllBookmarksQuery = {
  allBookmarks?:  Array< {
    __typename: "bookmark",
    id: string,
    url: string,
    description: string,
  } > | null,
};
