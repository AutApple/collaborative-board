import { optimizeMutations, type BoardMutationList } from '../../shared/board/board-mutation.js';
import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { AppContext } from '../app-context.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class BoardEventHandler extends BaseEventHandler {
  constructor(
    protected appContext: AppContext,
    protected client: Client,
  ) {
    super(appContext, client);
  }

  public onBoardMutations(mutations: BoardMutationList) {
    mutations = optimizeMutations(mutations);
    for (const mutation of mutations) {
      // console.log('Got mutation: ', mutation);
      // TODO: validate point array length, etc etc. only then apply mutations. reject on weird data
      this.appContext.board.applyMutation(mutation);
    }
    this.socket.broadcast.emit(ServerBoardEvents.BoardMutations, mutations);
  }

  public onRequestRefresh() {
    this.socket.emit(
      ServerBoardEvents.RefreshBoard,
      this.appContext.board.getElements().map((element) => element.toRaw()),
    );
  }
}
