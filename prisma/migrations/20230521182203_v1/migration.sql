-- CreateTable
CREATE TABLE "energy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nr_gemeinde" TEXT NOT NULL,
    "biogasanlagen_abwasser" REAL NOT NULL,
    "biogasanlagen_industrie" REAL NOT NULL,
    "biogasanlagen_landwirtschaft" REAL NOT NULL,
    "biomasse_holz" REAL NOT NULL,
    "einwohner" REAL NOT NULL,
    "gemeinde_name" TEXT NOT NULL,
    "jahr" TEXT NOT NULL,
    "kehricht" REAL NOT NULL,
    "photovoltaik" REAL NOT NULL,
    "wasserkraft" REAL NOT NULL,
    "wind" REAL NOT NULL,
    "total" REAL NOT NULL
);
