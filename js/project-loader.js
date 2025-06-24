class ProjectLoader {
    constructor() {
        this.projectData = {
            'U-Net Transplant: The Role of Pre-training for Model Merging in 3D Medical Segmentation': {
                'link': 'https://github.com/LucaLumetti/UNetTransplant',
                'html': 'unet-transplant.html'
            },
            'Segmenting Maxillofacial Structures in CBCT Volumes': {
                'link': 'https://github.com/LucaLumetti',
                'html': 'maxillofacial-cbct.html'
            },
            'Accurate 3D Medical Image Segmentation with Mambas': {
                'link': 'https://github.com/LucaLumetti',
                'html': 'accurate-mambas.html'
            },
            'Enhancing Patch-Based Learning for the Segmentation of the Mandibular Canal': {
                'link': 'https://github.com/LucaLumetti',
                'html': 'mandibular-canal.html'
            },
            'Location Matters: Harnessing Spatial Information to Enhance the Segmentation of the Inferior Alveolar Canal in CBCTs': {
                'link': 'https://github.com/LucaLumetti',
                'html': 'location-matters.html'
            },
            'A State-of-the-Art Review with Code about Connected Components Labeling on GPUs': {
                'link': 'https://github.com/LucaLumetti',
                'html': 'connected-components.html'
            },
            'Buffer-MIL: Robust multi-instance learning with a buffer-based approach': {
                'link': 'https://github.com/LucaLumetti',
                'html': 'buffer-mil.html'
            },
            'Segmenting the Inferior Alveolar Canal in CBCTs Volumes: the ToothFairy Challenge': {
                'link': 'https://github.com/LucaLumetti',
                'html': 'tooth-fairy.html'
            }
        };

        this.projects = Object.values(this.projectData).map(project => project.html);
        this.projectLinks = {};
        Object.keys(this.projectData).forEach(title => {
            this.projectLinks[title] = this.projectData[title].link;
        });
    }

    async loadProject(filename) {
        try {
            const response = await fetch(`projects/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading project ${filename}:`, error);
            return `<div class="project-error">Failed to load project: ${filename}</div>`;
        }
    }

    async loadAllProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) {
            console.error('Projects grid not found');
            return;
        }

        projectsGrid.innerHTML = '';

        for (const projectFile of this.projects) {
            const projectHTML = await this.loadProject(projectFile);
            projectsGrid.insertAdjacentHTML('beforeend', projectHTML);
        }

        this.setupClickHandlers();
    }

    setupClickHandlers() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const projectTitle = card.querySelector('.project-title')?.textContent;
            const link = this.projectLinks[projectTitle] || 'https://github.com/LucaLumetti';
            
            card.addEventListener('click', function() {
                window.open(link, '_blank');
            });
            
            card.style.cursor = 'pointer';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loader = new ProjectLoader();
    loader.loadAllProjects();
});
