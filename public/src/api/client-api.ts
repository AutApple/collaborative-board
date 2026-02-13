export interface ClientAPIBoard {
    id: string; 
    name: string;
    createdAt: Date; 
}
export class ClientAPI {
    static async getBoards(): Promise<Array<ClientAPIBoard>> {
        const response = await fetch('/api/boards');
        if (!response.ok) 
            throw new Error(`HTTP error! status: ${response.status}`);
        const boards = await response.json();

        for (const board of boards)
            if (!board.name || !board.createdAt || !board.id) 
                throw new Error(`Didn\'t retrieve proper board object on GET boards. Got instead: ${board}`);
        
        return boards;
    }

    static async addBoard(name: string): Promise<ClientAPIBoard> {
        const response = await fetch('/api/boards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({ name: name.trim() })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to create board');
            }

            const data = await response.json();
              if (!data.name || !data.createdAt || !data.id) 
                throw new Error(`Didn\'t retrieve proper board object on POST boards. Got instead: ${data}`);
            return data;
    }
    
}