package com.crystalcastle.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface AnalysisDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnalysis(entity: AnalysisEntity)

    @Query("SELECT * FROM analysis ORDER BY timestamp DESC")
    fun getAllAnalyses(): Flow<List<AnalysisEntity>>

    @Query("DELETE FROM analysis")
    suspend fun clearAll()
}
