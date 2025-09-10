// Check if env's are working
import { Client, Databases, ID, Query } from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
.setEndpoint('https://fra.cloud.appwrite.io/v1') // => points to Appwrite endpoint
.setProject(PROJECT_ID); // => your project ID

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // Should return the three id's
    //console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);

    //1. Use Appwrite SDK to check if the search term already exists.

    try {

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])
        
            //2. If it does, update the count.
        if(result.documents.length > 0) {

            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });

            console.log(`Updated search term "${searchTerm}" to count ${doc.count + 1}`);

            //3 If it doesn't, create a new document with the searchTerm and count of 1.

        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),
             {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                //Pass an object containing the data for the new document
            })
        }
    } catch (error) {
        console.error('Error checking search term:', error);
    }
    
}   

// Trending Page
export const getTrendingMovies = async () => {

    try {

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
            // Limit query to only show 5 movies
            // In a descending order (most searched/count first)
        ])
        
        return result.documents; // Return the documents array containing the trending movies

    } catch (error) {

        console.error('Error fetching trending movies:', error);
        
    }
}

// Add an error state to handle for errros in error message of trending