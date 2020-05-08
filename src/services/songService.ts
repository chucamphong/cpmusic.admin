import { Song } from "pages/Song/types";
import { Service } from "services/service";

export class SongService extends Service<Song> {
    constructor() {
        super("songs");
    }

    public uploadThumbnail(formData: FormData) {
        formData.append("type", "thumbnail");
        return this.http.post("upload", formData);
    }

    public uploadSong(formData: FormData) {
        formData.append("type", "song");
        return this.http.post("upload", formData);
    }
}

export default SongService;
