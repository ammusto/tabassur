# Tabaṣṣur

This is a simple react app to display manuscript images, basic line segmentation, and transcriptions.

## File Structures

The project follows this hierarchical structure:

```
msdata/
│
├── metadata.csv             # Master metadata file containing information for all manuscripts
│
├── T001/                   # Manuscript folder (example)
│   ├── ms_data.csv        # Individual manuscript data
│   ├── img/               # Full-size manuscript images
│   │   ├── 1.jpg
│   │   ├── 2.jpg
│   │   └── ...
│   │
│   └── thumbnails/        # Thumbnail images (400px height)
│       ├── 1.jpg
│       ├── 2.jpg
│       └── ...
│
├── T002/                   # Another manuscript folder
│   ├── ms_data.csv
│   ├── img/
│   │   └── ...
│   └── thumbnails/
│       └── ...
│
└── ...                     # Additional manuscript folders
```

- **msdata/**: Root directory containing all manuscript data
  - **metadata.csv**: Contains metadata for all manuscripts in the collection
  - **[MS_ID]/**: Individual manuscript folders (e.g., T001, T002, etc.)
    - **ms_data.csv**: Contains detailed data specific to this manuscript
    - **img/**: Contains full-resolution manuscript images
    - **thumbnails/**: Contains thumbnail versions of manuscript images (400px height)

Each manuscript folder follows the same structure, making it easy to process and access data programmatically.

## Data Structure Details

This is a static site that uses individual MS images as well as CSVs to store the metadata and MS contents.

### Metadata

Below is an example of how the manuscript data is structured in metadata CSV files:

| Field | Example Value |
|-------|--------------|
| manuscript_id | T003 |
| title_ar | مستخرجة من فوائد أبي منصور |
| title_lat | Mustakhraja min fawāʾid Abī Manṣūr |
| section | N/A |
| description | These are ḥadīth from a larger, lost work by Abū Manṣūr al-Iṣfahānī, a Ḥanbalī scholar and Sufi author. He has several extant works, the majority of which focus on Sufism, although he authored a Ḥanbalī creed. |
| issues | None. |
| date | 418/1027 |
| language | Arabic |
| published | No |
| total_folios | 3 |
| total_images | 5 |
| author_lat | Abū Manṣūr al-Iṣfahānī |
| author_ar | أبو منصور الأصفهاني |
| scribe | MS 6207 ف |
| collection_name | Islamic University of Madinah |
| library | Islamic University of Madinah |
| start_folio | 83b |
| end_folio | 85a |
| copyright | IUM |
| translation | FALSE |
| bw | TRUE |

This table shows all fields present in the CSV with an example record. Each manuscript entry contains these 20 fields with their respective values.

### MS Data

Below is an example of how the line-by-line transcription data is structured in our CSV files:

| Field | Example Value |
|-------|--------------|
| image_id | 1 |
| folio | 25a |
| line | 1 |
| start_x | 298.12 |
| start_y | 141.945 |
| end_x | 1248.96 |
| end_y | 226.76 |
| transcription | بِسمِ اللَّهِ الرَّحمَنِ الرَّحِيمِ عَونُكَ اللَّهُمَّ |


Each entry represents a single line of text on a manuscript page, with coordinates indicating the line's position and full transcription of the text. Future versions will incorporate translations.

## Future Directions

* **Line Segmentation Enhancement** - Incorporate more robust line segmentation (currently manual process)

* **Translation Support** - Add translation display to the platform

* **Arabic Diacritics Control** - Implement toggle functionality for tashkīl/harakāt

* **Metadata Enhancement** - Improve metadata structure and capabilities

* **Marginalia Management** - Develop better systems for handling marginalia

* **Annotation System** - Add basic annotation functionality

