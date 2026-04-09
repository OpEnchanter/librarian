"use server"

export type searchResult = {
    author: string,
    title: string,
    pages: number,
    publishDate: string,
    publishers: string[]
}

type doc = {
    key: string
    edition_key: string[],
    title: string,
    author_name: string[]
}

type isbnSearchResult = {
    docs: doc[]
}

type keyType = {
    key: string
}

type bookSearchResult = {
    isbn_13?: string[],
    pagination: string,
    publish_date: string,
    languages: keyType[],
    publishers: string[]
}

export async function isbnSearch(isbn: string) {
    console.log("Beginning ISBN Search!")
    // Search using the ISBN to get a list of book editions
    const res = await fetch(`https://openlibrary.org/search.json?isbn=${isbn}&fields=key,edition_key,title,author_name`);
    const body = await res.json();
    const isbnSearch = body as isbnSearchResult;
    console.log(isbnSearch);
    const editionKeys = isbnSearch.docs[0].edition_key;
    const workTitle = isbnSearch.docs[0].title;
    const workAuthor = isbnSearch.docs[0].author_name[0];

    let bookSearchResult: bookSearchResult = {} as bookSearchResult;
    
    console.log("[Library] Iterating editions")
    for (const key of editionKeys) {
        console.log(`   -> Checking Edition: ${key}`)
        const res = await fetch(`https://openlibrary.org/books/${key}.json`);
        const body = await res.json();
        const fullSearchResult = body as bookSearchResult;


        if (!Array.isArray(fullSearchResult?.isbn_13) || !fullSearchResult.isbn_13[0].includes(isbn)) continue;
        console.log("[Library] Found correct edition!")
        bookSearchResult = fullSearchResult;
        break;
    }

    if (bookSearchResult) {
         return {
            author: workAuthor,
            title: workTitle,
            pages: parseInt(bookSearchResult.pagination),
            publishDate: bookSearchResult.publish_date,
            publishers: bookSearchResult.publishers
        } as searchResult
    } else {
        return {
            author: workAuthor,
            title: workTitle,
        } as searchResult
    }
}
