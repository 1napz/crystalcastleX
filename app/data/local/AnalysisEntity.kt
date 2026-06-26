package com.crystalcastle.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "analysis")
data class AnalysisEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val request: String,
    val result: String,
    val timestamp: Long
)
