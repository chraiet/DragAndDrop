
namespace App {
    type Listener<T> = (items: T[]) => void
    
    class State<T> {
        protected listeners: Listener<T>[] = []
    
        addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn)
        }
    }
    
    //  Project State Management
    export class ProjectState extends State<Project> {
        private projects: Project[] = []
        private static instance: ProjectState
    
        private constructor() {
            super()
        }
    
        //  We manage the single instance inside a property
        static getInstance() {
            if (this.instance) {
                return this.instance
            }
            this.instance = new ProjectState()
            return this.instance
        }
    
        addProject(title: string, description: string, numOfPeople: number) {
            const id = Math.random().toString()
            const newProject = new Project(
                id, title, description, numOfPeople, ProjectStatus.Active
            )
    
            this.projects.push(newProject)
            this.updateListeners()
        }
    
        moveProject(projectId: string, newStatus: ProjectStatus) {
            const projectToMove = this.projects.find(project => project.id === projectId)
            if (projectToMove && projectToMove.status != newStatus) {
                projectToMove.status = newStatus
                this.updateListeners()
            }
        }
    
        private updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice())
            }
        }
    }
    
    export const projectState = ProjectState.getInstance()
}
