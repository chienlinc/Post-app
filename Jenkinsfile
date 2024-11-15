pipeline {
    agent any

    tools {
        nodejs 'NodeJS 23.2.0'
        dockerTool 'Docker'
    }
    
    environment {
        MONGO_URI_TEST = credentials('mongo-uri-test')
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE_NAME = credentials('docker-image-name')
        DOCKER_IMAGE_TAG = 'latest'
    }

    stages {
        // stage('Clone Repository') {
        //     steps {
        //         git branch: 'main', 
        //         url: 'https://github.com/chienlinc/Post-app.git'
        //     }
        // }
        
        stage('Build App') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Test App') {
            steps {
                script {
                    withEnv(["MONGO_URI_TEST=${env.MONGO_URI_TEST}"]) {
                        sh 'printenv MONGO_URI_TEST'
                        sh 'npm test'
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                    docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} .
                    '''
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                        docker login -u "${DOCKER_USERNAME}" -p "$DOCKER_PASSWORD" ${DOCKER_REGISTRY}
                        docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                        docker logout
                        """
                    }
                }
            }
        }
    }
    
}