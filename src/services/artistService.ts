import { Artist } from "pages/Artists/types";
import { Service } from "services/service";

class ArtistService extends Service<Artist> {
    constructor() {
        super("artists");
    }

    public uploadAvatar(formData: FormData) {
        formData.append("type", "artist");
        return this.http.post("upload", formData);
    }
}

export default ArtistService;
