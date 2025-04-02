# seis Colores

Color palettes generated from Mexican architecture. 

# Adding new palettes

1. Export photo from Lightroom with preset `For Portfolio - Large`
1. Put photo in `src/images`
1. Run `scripts/sync-palettes.ts` to add the palette to `src/palettes.json`
1. Open localhost:5173/ ... and pick colors. Populate in `src/palettes.json`
 (add some syncing method here)

 # Dev Notes

 - On deploy of a build with no code changes, the server has an issue of not being able to find the bundle. 