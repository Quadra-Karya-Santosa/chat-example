import { ChatPaginationI, ChatResponse } from "../../../interfaces/chat";

import { Api } from "../..//api";

export const chatApi = Api.injectEndpoints({
  endpoints: (build) => ({
    listChat: build.query<ChatResponse, ChatPaginationI>({
      query(params) {
        return {
          url: "/free/chat",
          params,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLazyListChatQuery } = chatApi;

