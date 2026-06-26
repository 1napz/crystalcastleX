package com.crystalcastle.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [AnalysisEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun analysisDao(): AnalysisDao
}
