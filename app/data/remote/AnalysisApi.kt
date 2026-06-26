interface AnalysisApi {
    @POST("analyze")
    suspend fun analyze(
        @Body request: AnalysisRequest
    ): AnalysisResponse
}
