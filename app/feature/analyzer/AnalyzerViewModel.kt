@HiltViewModel
class AnalyzerViewModel @Inject constructor(
    private val repository: AnalyzerRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState

    fun analyze(request: AnalysisRequest) {
        viewModelScope.launch {
            _uiState.value = UiState(loading = true)
            val result = repository.analyze(request)
            _uiState.value = result.fold(
                onSuccess = { UiState(result = it) },
                onFailure = { UiState(error = it.message) }
            )
        }
    }
}
