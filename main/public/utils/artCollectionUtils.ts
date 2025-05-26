import { actionCreateCollection, actionDeleteCollection, actionGetArtCollections, actionUpdateCollection } from "@/actions/artCollectionActions";
import { Result } from "@/types/result";
import { ArtCollection } from "@/types/types";

export async function getArtCollections(): Promise<Result<ArtCollection[]>> {
    const res = await actionGetArtCollections();

    if (res.error) {
        return new Result<ArtCollection[]>(undefined, res.message);
    } else {
        return new Result<ArtCollection[]>(res.data, res.message);
    }
}

export async function createCollection(collection: ArtCollection): Promise<Result<ArtCollection>> {
    const res = await actionCreateCollection(collection);

    if (res.error) {
        return new Result<ArtCollection>(undefined, res.message);
    } else {
        return new Result<ArtCollection>(res.data, res.message);
    }
}

export async function updateCollection(searchName: string, collection: ArtCollection): Promise<Result<boolean>> {
    const res = await actionUpdateCollection(searchName, collection);

    if (res.error) {
        return new Result<boolean>(undefined, res.message);
    } else {
        return new Result<boolean>(res.data, res.message);
    }
}

export async function deleteCollection(collection: ArtCollection): Promise<Result<boolean>> {
    const res = await actionDeleteCollection(collection);

    if (res.error) {
        return new Result<boolean>(undefined, res.message);
    } else {
        return new Result<boolean>(res.data, res.message);
    }
}