import { Song } from "pages/Song/types";
import { Service } from "services/service";

export class SongService extends Service<Song> {
    constructor() {
        super("songs");
    }
}

export default SongService;
