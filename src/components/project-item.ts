
namespace App {
    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
        get persons() {
            return `${this.project.people} ${this.project.people > 1 ? 'persons' : 'person'}`
        }

        constructor(hostId: string, private project: Project) {
            super('single-project', hostId, false, project.id)
        
            this.configure()
            this.renderContent()
        }

        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler)
            this.element.addEventListener('dragend', this.dragEndHandler)
        }

        renderContent() {
            this.element.querySelector('h2')!.textContent = this.project.title
            this.element.querySelector('h3')!.textContent = `${this.persons} assigned`
            this.element.querySelector('p')!.textContent = this.project.description
        }

        @Autobind
        dragStartHandler(event: DragEvent): void {
            event.dataTransfer!.setData('text/plain', this.project.id)
            event.dataTransfer!.effectAllowed = 'move'
        }

        @Autobind
        dragEndHandler(event: DragEvent): void {
            console.log('Drag End')
            console.log(event)
        }
    }
}
