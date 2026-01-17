export enum ServerBoardEvents {
    // AddElement = 'addElement', // outdated - use BoardMutations instead
    BoardMutations = 'boardMutations',
    RefreshBoard = 'refreshBoard',
}

export enum ClientBoardEvents {
    // AddElement = 'addElement', // outdated - use BoardMutations instead
    BoardMutations = 'boardMutations',
    RequestRefresh = 'requestRefresh'
}