Version 1: Movie - React - App

Learned how to use an external API using TMDB.
Learned how to use APPWRITE as a way to track movie data for trending orders.

//Improvements to do
// Add loading and error states for trending movies function.
// Add a type of filter in search to fix a bug where the searchTerm when saved in db sometimes similar: Scenarios like Silent Voice -> saved, Silent Voide + space -> saved as a different searchTerm. It needs to remove spaces and special characters and make it lowercase only. So that it can be consistent.