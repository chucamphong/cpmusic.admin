import { Artist } from "pages/Artists/types";
import { Service } from "services/service";

class ArtistService extends Service<Artist> {
    constructor() {
        super("artists");
    }
}

export default ArtistService;
