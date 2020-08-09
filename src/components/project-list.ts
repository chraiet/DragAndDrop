namespace App {
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
        assignedProjects: Project[]
    
        constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false, `${type}-projects`)
            this.assignedProjects = []
    
            this.configure()
            this.renderContent()
        }
    
        private renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement
    
            listEl.innerHTML = ''
            for (const prjItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
            }
        }
    
        renderContent() {
            const listId = `${this.type}-projects-list`
            this.element.querySelector('ul')!.id = listId
            this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`
        }
    
        configure() {
            projectState.addListener((projects: Project[]) => {
                const relevantProjects = projects.filter(
                    project => {
                        if (this.type === 'active') {
                            return project.status === ProjectStatus.Active
                        }
                        return project.status === ProjectStatus.Finished
                    }
                )
    
                this.assignedProjects = relevantProjects
                this.renderProjects()
            })
    
            this.element.addEventListener('dragover', this.dragOverHandler)
            this.element.addEventListener('dragleave', this.dragLeaveHandler)
            this.element.addEventListener('drop', this.dropHandler)
        }
    
        @Autobind
        dragOverHandler(event: DragEvent): void {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault()
                const listEl = this.element.querySelector('ul')!
                listEl.classList.add('droppable')
            }
        }
    
        @Autobind
        dragLeaveHandler(_: DragEvent): void {
            const listEl = this.element.querySelector('ul')!
            listEl.classList.remove('droppable')
        }
    
        @Autobind
        dropHandler(event: DragEvent): void {
            const projectId = event.dataTransfer!.getData('text/plain')
            const newStatus = this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
            projectState.moveProject(projectId, newStatus)
        }
    }
}