pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        SERVER_HOST     = '206.189.142.129'
        REMOTE_APP_DIR  = '/var/www/html/kseb-analytics'
        GITHUB_REPO_URL = 'git@github.com:swaraj-xocortx/spontaine-demo.git'
        GITHUB_BRANCH   = 'main'
    }

    stages {

        stage('Checkout (Webhook Anchor)') {
            steps {
                checkout scm
            }
        }

        stage('Update Code on Server') {
            steps {
                sshagent(['ssh-to-server-mam']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no root@${SERVER_HOST} "
                            cd ${REMOTE_APP_DIR} &&
                            git pull origin ${GITHUB_BRANCH}
                        "
                    """
                }
            }
        }

        stage('Composer Install on Server') {
            steps {
                sshagent(['ssh-to-server-mam']) {
                    sh """
                        ssh root@${SERVER_HOST} "
                            cd ${REMOTE_APP_DIR} &&
                            composer install --no-dev --optimize-autoloader
                        "
                    """
                }
            }
        }

        stage('NPM Install & Build') {
            steps {
                sshagent(['ssh-to-server-mam']) {
                    sh """
                        ssh root@${SERVER_HOST} "
                            cd ${REMOTE_APP_DIR} &&
                            npm install &&
                            npm run build
                        "
                    """
                }
            }
        }

        stage('PHP Migrate') {
            steps {
                sshagent(['ssh-to-server-mam']) {
                    sh """
                        ssh root@${SERVER_HOST} "
                            cd ${REMOTE_APP_DIR} &&
                            php artisan migrate
                        "
                    """
                }
            }
        }
    }
    post {
        success {
            emailext (
                to: 'harikrishnanbs.xocortex@gmail.com, swarajk120@gmail.com',
                from: 'harikrishnanbs2000@gmail.com',
                replyTo: 'harikrishnanbs2000@gmail.com',
                subject: "✅ SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Hello Team,
                
                The build finished SUCCESSFULLY 🎉  
                Project: ${env.JOB_NAME}  
                Build Number: ${env.BUILD_NUMBER}  
                Check Console: ${env.BUILD_URL}"""
            )
        }
        failure {
            emailext (
                to: 'harikrishnanbs.xocortex@gmail.com, swarajk120@gmail.com',
                from: 'harikrishnanbs2000@gmail.com',
                replyTo: 'harikrishnanbs2000@gmail.com',
                subject: "❌ FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Hello Team,
                
                The build FAILED 💥  
                Project: ${env.JOB_NAME}  
                Build Number: ${env.BUILD_NUMBER}  
                Check Console: ${env.BUILD_URL}"""
            )
        }
    }
}
