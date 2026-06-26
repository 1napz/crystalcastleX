class AnalyzerRepository(
    private val api: AnalysisApi
) {
    suspend fun analyze(request: AnalysisRequest): Result<AnalysisResponse> {
        return runCatching { api.analyze(request) }
    }
}
