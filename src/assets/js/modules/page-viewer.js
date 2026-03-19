export const pageViewer = (items = []) => {
    if (process.env.NODE_ENV === "production") {
        return
    }

    renderPageViewerContainer()

    const pageViewerStatus = localStorage.getItem("page-viewer-status")
    const pageViewerContainer = document.getElementById("page-viewer")

    if (!pageViewerContainer) return

    renderList(items, pageViewerContainer)

    if (pageViewerStatus === "closed") {
        pageViewerContainer.classList.add("page-viewer--hidden")
    }

    const numberOfPagesElement = pageViewerContainer.querySelector("#page-viewer__number")
    const button = pageViewerContainer.querySelector("#page-viewer__button")

    button.addEventListener("click", () => togglePageViewerContainerStatus(pageViewerContainer))

    numberOfPagesElement.textContent = items.length
}

function renderPageViewerContainer() {
    const div = document.createElement("div")

    div.classList.add("page-viewer")
    div.id = "page-viewer"

    div.innerHTML = `
        <div class="page-viewer__inner">
            <div class="page-viewer__header">
                <span>Pages:</span>
                <span id="page-viewer__number">0</span>
            </div>
        </div>

        <button 
            class="page-viewer__button" 
            id="page-viewer__button" 
            type="button" 
            aria-label="Show or hide page viewer" 
            title="Show or hide page viewer"
        ></button>
    `

    document.body.append(div)
}

function renderList(items, pageViewerContainer) {
    const inner = pageViewerContainer.firstElementChild
    const list = document.createElement("ul")

    list.classList.add("page-viewer__list")

    items.forEach((item) => {
        list.insertAdjacentHTML(
            "beforeend",
            `
            <li class="page-viewer__item">
                <a class="page-viewer__link" href="${item.url}">${item.label}</a>
            </li>
        `
        )
    })

    inner.append(list)
}

function togglePageViewerContainerStatus(pageViewerContainer) {
    if (pageViewerContainer.classList.contains("page-viewer--hidden")) {
        pageViewerContainer.classList.remove("page-viewer--hidden")
        localStorage.setItem("page-viewer-status", "opened")
    } else {
        pageViewerContainer.classList.add("page-viewer--hidden")
        localStorage.setItem("page-viewer-status", "closed")
    }
}
