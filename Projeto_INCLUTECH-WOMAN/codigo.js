/* ==================== VARIÁVEIS GLOBAIS ==================== */
        let usuarioTipo = ''; // Armazena o tipo de usuário: 'usuaria' ou 'empregador'
        let usuarioNome = ''; // Armazena o nome do usuário
        let usuarioEmail = ''; // Armazena o e-mail do usuário

        // Lista de domínios de e-mail válidos
        const dominiosValidos = [
            'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 
            'yahoo.com', 'icloud.com', 'live.com', 'uol.com.br',
            'bol.com.br', 'terra.com.br', 'ig.com.br'
        ];

        /* ==================== FUNÇÕES DE VALIDAÇÃO ==================== */
        
        /**
         * Valida se o e-mail possui um formato correto E um domínio válido
         * @param {string} email - E-mail a ser validado
         * @returns {boolean} - True se o e-mail for válido
         */
        function validarEmail(email) {
            // Verifica formato básico do e-mail
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(email)) {
                return false;
            }
            
            // Extrai o domínio do e-mail (parte após o @)
            const dominio = email.split('@')[1];
            
            // Verifica se o domínio está na lista de domínios válidos
            return dominiosValidos.includes(dominio.toLowerCase());
        }

        /**
         * Valida se a senha tem no mínimo 6 caracteres
         * @param {string} senha - Senha a ser validada
         * @returns {boolean} - True se a senha for válida
         */
        function validarSenha(senha) {
            return senha.length >= 6;
        }

        /**
         * Verifica a força da senha e atualiza a barra visual
         * Fraca: < 6 caracteres
         * Média: 6-9 caracteres
         * Forte: >= 10 caracteres
         */
        function verificarForcaSenha() {
            const senha = document.getElementById('cadastroSenha').value;
            const bar = document.getElementById('senhaStrengthBar');
            
            // Remove todas as classes anteriores
            bar.className = 'password-strength-bar';
            
            if (senha.length === 0) {
                bar.style.width = '0';
            } else if (senha.length < 6) {
                bar.classList.add('weak');
            } else if (senha.length < 10) {
                bar.classList.add('medium');
            } else {
                bar.classList.add('strong');
            }
        }

        /**
         * Mostra ou esconde mensagem de erro em um campo
         * @param {string} campoId - ID do campo input
         * @param {string} mensagemId - ID da mensagem de erro
         * @param {boolean} mostrar - Se deve mostrar ou esconder o erro
         */
        function mostrarErro(campoId, mensagemId, mostrar = true) {
            const campo = document.getElementById(campoId);
            const mensagem = document.getElementById(mensagemId);
            
            if (mostrar) {
                campo.classList.add('error');
                mensagem.classList.add('show');
            } else {
                campo.classList.remove('error');
                mensagem.classList.remove('show');
            }
        }

        /**
         * Exibe uma notificação temporária na tela
         * @param {string} texto - Texto da notificação
         * @param {string} tipo - Tipo: 'success' ou 'error'
         */
        function mostrarNotificacao(texto, tipo = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = texto;
            notification.className = `notification ${tipo} show`;
            
            // Remove a notificação após 4 segundos
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        /* ==================== VALIDAÇÕES DE FORMULÁRIOS ==================== */
        
        /**
         * Valida o formulário de login
         * Verifica e-mail e senha antes de prosseguir
         */
        function validarLogin() {
            const email = document.getElementById('loginEmail').value.trim();
            const senha = document.getElementById('loginSenha').value;
            
            let valido = true;
            
            // Valida e-mail com domínio válido
            if (!validarEmail(email)) {
                mostrarErro('loginEmail', 'loginEmailError');
                valido = false;
            } else {
                mostrarErro('loginEmail', 'loginEmailError', false);
            }
            
            // Valida senha
            if (!validarSenha(senha)) {
                mostrarErro('loginSenha', 'loginSenhaError');
                valido = false;
            } else {
                mostrarErro('loginSenha', 'loginSenhaError', false);
            }
            
            // Se tudo estiver válido, avança para escolha de tipo de usuário
            if (valido) {
                usuarioEmail = email;
                escolherTipoUsuario();
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos corretamente.', 'error');
            }
        }

        /**
         * Valida o formulário de cadastro
         * Verifica nome, e-mail, senha e confirmação de senha
         */
        function validarCadastro() {
            const nome = document.getElementById('cadastroNome').value.trim();
            const email = document.getElementById('cadastroEmail').value.trim();
            const senha = document.getElementById('cadastroSenha').value;
            const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value;
            
            let valido = true;
            
            // Valida nome (mínimo 3 caracteres)
            if (nome.length < 3) {
                mostrarErro('cadastroNome', 'cadastroNomeError');
                valido = false;
            } else {
                mostrarErro('cadastroNome', 'cadastroNomeError', false);
            }
            
            // Valida e-mail com domínio válido
            if (!validarEmail(email)) {
                mostrarErro('cadastroEmail', 'cadastroEmailError');
                valido = false;
            } else {
                mostrarErro('cadastroEmail', 'cadastroEmailError', false);
            }
            
            // Valida senha
            if (!validarSenha(senha)) {
                mostrarErro('cadastroSenha', 'cadastroSenhaError');
                valido = false;
            } else {
                mostrarErro('cadastroSenha', 'cadastroSenhaError', false);
            }
            
            // Valida confirmação de senha
            if (senha !== confirmaSenha) {
                mostrarErro('cadastroConfirmaSenha', 'confirmarSenhaError');
                valido = false;
            } else {
                mostrarErro('cadastroConfirmaSenha', 'confirmarSenhaError', false);
            }
            
            // Se tudo estiver válido, salva dados e avança
            if (valido) {
                usuarioNome = nome;
                usuarioEmail = email;
                escolherTipoUsuario();
            } else {
                mostrarNotificacao('Por favor, corrija os erros no formulário.', 'error');
            }
        }

        /**
         * Valida os dados específicos da usuária
         * Verifica área de interesse, nível de experiência e telefone
         */
        function validarDadosUsuaria() {
            const area = document.getElementById('areaInteresse').value;
            const nivel = document.getElementById('nivelExp').value;
            const telefone = document.getElementById('telefone').value;
            
            let valido = true;
            
            // Valida seleção de área
            if (!area) {
                mostrarErro('areaInteresse', 'areaInteresseError');
                valido = false;
            } else {
                mostrarErro('areaInteresse', 'areaInteresseError', false);
            }
            
            // Valida seleção de nível
            if (!nivel) {
                mostrarErro('nivelExp', 'nivelExpError');
                valido = false;
            } else {
                mostrarErro('nivelExp', 'nivelExpError', false);
            }
            
            // Valida telefone (deve estar formatado com pelo menos 14 caracteres)
            if (telefone.length < 14) {
                mostrarErro('telefone', 'telefoneError');
                valido = false;
            } else {
                mostrarErro('telefone', 'telefoneError', false);
            }
            
            // Se tudo estiver válido, entra na plataforma
            if (valido) {
                entrarPlataforma();
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        }

        /**
         * Valida os dados específicos do empregador
         * Verifica nome da empresa, CNPJ e setor
         */
        function validarDadosEmpregador() {
            const nomeEmpresa = document.getElementById('nomeEmpresa').value.trim();
            const cnpj = document.getElementById('cnpj').value;
            const setor = document.getElementById('setor').value;
            
            let valido = true;
            
            // Valida nome da empresa (mínimo 3 caracteres)
            if (nomeEmpresa.length < 3) {
                mostrarErro('nomeEmpresa', 'nomeEmpresaError');
                valido = false;
            } else {
                mostrarErro('nomeEmpresa', 'nomeEmpresaError', false);
            }
            
            // Valida CNPJ (deve estar formatado com 18 caracteres)
            if (cnpj.length < 18) {
                mostrarErro('cnpj', 'cnpjError');
                valido = false;
            } else {
                mostrarErro('cnpj', 'cnpjError', false);
            }
            
            // Valida seleção de setor
            if (!setor) {
                mostrarErro('setor', 'setorError');
                valido = false;
            } else {
                mostrarErro('setor', 'setorError', false);
            }
            
            // Se tudo estiver válido, entra na plataforma
            if (valido) {
                entrarPlataforma();
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        }

        /* ==================== FORMATAÇÃO DE CAMPOS ==================== */
        
        /**
         * Formata o telefone automaticamente enquanto o usuário digita
         * Formato: (00) 00000-0000
         * @param {HTMLElement} input - Campo de input do telefone
         */
        function formatarTelefone(input) {
            // Remove tudo que não é número
            let valor = input.value.replace(/\D/g, '');
            
            // Aplica a máscara de telefone
            if (valor.length <= 11) {
                valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                valor = valor.replace(/^(\d*)/, '($1');
            }
            
            input.value = valor;
        }

        /**
         * Formata o CNPJ automaticamente enquanto o usuário digita
         * Formato: 00.000.000/0000-00
         * @param {HTMLElement} input - Campo de input do CNPJ
         */
        function formatarCNPJ(input) {
            // Remove tudo que não é número
            let valor = input.value.replace(/\D/g, '');
            
            // Aplica a máscara de CNPJ
            if (valor.length <= 14) {
                valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
                valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
                valor = valor.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
                valor = valor.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
            }
            
            input.value = valor;
        }

        /* ==================== NAVEGAÇÃO ENTRE FORMULÁRIOS ==================== */
        
        /**
         * Exibe o formulário de login e esconde o de cadastro
         */
        function mostrarLogin() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('cadastroForm').classList.add('hidden');
            limparErros();
        }

        /**
         * Exibe o formulário de cadastro e esconde o de login
         */
        function mostrarCadastro() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('cadastroForm').classList.remove('hidden');
            limparErros();
        }

        /**
         * Remove todas as mensagens de erro e classes de erro dos campos
         */
        function limparErros() {
            document.querySelectorAll('.error-message').forEach(msg => {
                msg.classList.remove('show');
            });
            document.querySelectorAll('.error').forEach(campo => {
                campo.classList.remove('error');
            });
        }

        /**
         * Exibe a tela de escolha do tipo de usuário
         */
        function escolherTipoUsuario() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('cadastroForm').classList.add('hidden');
            document.getElementById('tipoUsuarioForm').classList.remove('hidden');
            limparErros();
        }

        /**
         * Define o tipo como usuária e exibe formulário de dados
         */
        function preencherDadosUsuaria() {
            usuarioTipo = 'usuaria';
            document.getElementById('tipoUsuarioForm').classList.add('hidden');
            document.getElementById('dadosUsuariaForm').classList.remove('hidden');
        }

        /**
         * Define o tipo como empregador e exibe formulário de dados
         */
        function preencherDadosEmpregador() {
            usuarioTipo = 'empregador';
            document.getElementById('tipoUsuarioForm').classList.add('hidden');
            document.getElementById('dadosEmpregadorForm').classList.remove('hidden');
        }

        /* ==================== ENTRADA NA PLATAFORMA ==================== */
        
        /**
         * Finaliza o cadastro/login e exibe a plataforma principal
         * Configura interface específica para cada tipo de usuário
         */
        function entrarPlataforma() {
            const nome = usuarioNome || 'Usuária';
            
            // Esconde tela de login e exibe plataforma
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainPlatform').style.display = 'block';
            
            // Define inicial do usuário no ícone
            document.getElementById('userIcon').textContent = nome.charAt(0).toUpperCase();

            // Configurações específicas para empregador
            if (usuarioTipo === 'empregador') {
                document.getElementById('vagasDescricao').textContent = 'Divulgue suas vagas e encontre talentos';
                document.getElementById('divulgarVagaForm').classList.remove('hidden');
                document.getElementById('minhasVagasDesc').textContent = 'Gerencie suas vagas publicadas';
            }

            // Exibe notificação de boas-vindas
            mostrarNotificacao(`Bem-vinda, ${nome}! `, 'success');
        }

        /* ==================== NAVEGAÇÃO ENTRE ABAS ==================== */
        
        /**
         * Exibe uma aba específica e esconde as outras
         * Atualiza o menu de navegação para destacar a aba ativa
         * @param {string} aba - ID da aba a ser exibida
         */
        function mostrarAba(aba) {
            // Esconde todas as abas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Exibe a aba selecionada
            document.getElementById(aba).classList.add('active');

            // Atualiza destaque do menu
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Destaca o link clicado
            if (event && event.target) {
                event.target.classList.add('active');
            }
        }

        /**
         * Alterna a exibição do menu dropdown do usuário
         */
        function toggleDropdown() {
            document.querySelector('.dropdown').classList.toggle('active');
        }

        /* ==================== FUNCIONALIDADES DA PLATAFORMA ==================== */
        
        /**
         * Exibe detalhes completos de um curso
         * @param {string} curso - Identificador do curso
         */
        function verDetalhes(curso) {
            const detalhes = {
                web: 'Curso completo de Desenvolvimento Web Full Stack. Inclui: HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, MongoDB. Projetos práticos e certificado ao final.',
                data: 'Formação completa em Ciência de Dados. Conteúdo: Python, Pandas, NumPy, Scikit-learn, TensorFlow, visualização de dados, estatística aplicada.',
                ux: 'Curso de UX/UI Design. Aprenda: Design Thinking, Pesquisa com usuários, Wireframes, Prototipação em Figma, Testes de usabilidade, Design System.',
                sec: 'Formação em Segurança da Informação. Módulos: Fundamentos de segurança, Ethical Hacking, Criptografia, Análise de vulnerabilidades, Resposta a incidentes.'
            };
            mostrarNotificacao(detalhes[curso], 'success');
        }

        /**
         * Processa candidatura a uma vaga
         * @param {string} vaga - Identificador da vaga
         */
        function candidatar(vaga) {
            mostrarNotificacao('Candidatura enviada com sucesso! Você receberá um e-mail com os próximos passos. 💜', 'success');
        }

        /**
         * Processa entrada em uma comunidade
         * @param {string} comunidade - Identificador da comunidade
         */
        function entrarComunidade(comunidade) {
            mostrarNotificacao('Bem-vinda à comunidade! Você já pode começar a interagir com outras mulheres em TI. 💜', 'success');
        }

        /**
         * Publica uma nova vaga (apenas para empregadores)
         * Valida todos os campos antes de publicar
         */
        function publicarVaga() {
            const titulo = document.getElementById('tituloVaga').value.trim();
            const descricao = document.getElementById('descricaoVaga').value.trim();
            const local = document.getElementById('localVaga').value.trim();
            
            let valido = true;
            
            // Valida título
            if (!titulo) {
                mostrarErro('tituloVaga', 'tituloVagaError');
                valido = false;
            } else {
                mostrarErro('tituloVaga', 'tituloVagaError', false);
            }
            
            // Valida descrição
            if (!descricao) {
                mostrarErro('descricaoVaga', 'descricaoVagaError');
                valido = false;
            } else {
                mostrarErro('descricaoVaga', 'descricaoVagaError', false);
            }
            
            // Valida localização
            if (!local) {
                mostrarErro('localVaga', 'localVagaError');
                valido = false;
            } else {
                mostrarErro('localVaga', 'localVagaError', false);
            }
            
            // Se tudo válido, publica e limpa formulário
            if (valido) {
                mostrarNotificacao('Vaga publicada com sucesso! Em breve aparecerá na lista de oportunidades. 💜', 'success');
                document.getElementById('tituloVaga').value = '';
                document.getElementById('descricaoVaga').value = '';
                document.getElementById('localVaga').value = '';
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos da vaga.', 'error');
            }
        }

        /**
         * Salva alterações do perfil do usuário
         */
        function salvarPerfil() {
            mostrarNotificacao('Perfil atualizado com sucesso! ', 'success');
        }

        /**
         * Processa assinatura de um plano
         * @param {string} plano - Tipo do plano (premium, empresarial)
         */
        function assinarPlano(plano) {
            mostrarNotificacao(`Redirecionando para pagamento do plano ${plano}...`, 'success');
        }

        /**
         * Realiza logout do usuário e volta para tela de login
         */
        function sair() {
            if (confirm('Deseja realmente sair?')) {
                // Esconde plataforma e exibe tela de login
                document.getElementById('mainPlatform').style.display = 'none';
                document.getElementById('loginScreen').style.display = 'flex';
                
                // Reseta todos os formulários para estado inicial
                document.getElementById('loginForm').classList.remove('hidden');
                document.getElementById('cadastroForm').classList.add('hidden');
                document.getElementById('tipoUsuarioForm').classList.add('hidden');
                document.getElementById('dadosUsuariaForm').classList.add('hidden');
                document.getElementById('dadosEmpregadorForm').classList.add('hidden');
                
                // Limpa erros
                limparErros();
                
                // Exibe mensagem de despedida
                mostrarNotificacao('Até breve! ', 'success');
            }
        }

        /* ==================== EVENT LISTENERS ==================== */
        
        /**
         * Fecha o dropdown ao clicar fora dele
         */
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.dropdown')) {
                document.querySelector('.dropdown').classList.remove('active');
            }
        });

        /**
         * Remove erros automaticamente quando o usuário começa a digitar
         * Melhora a experiência do usuário
         */
        document.addEventListener('input', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
                const errorId = event.target.id + 'Error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    event.target.classList.remove('error');
                    errorElement.classList.remove('show');
                }
            }
        });
          /**
         * Exibe uma aba específica e esconde as outras
         * Atualiza o menu de navegação para destacar a aba ativa
         * @param {string} aba - ID da aba a ser exibida
         */
        function mostrarAba(aba) {
            // Esconde todas as abas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Exibe a aba selecionada
            document.getElementById(aba).classList.add('active');

            // Atualiza destaque do menu - Remove active de todos os links
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Adiciona active ao link correspondente à aba atual
            document.querySelectorAll('.nav-menu a').forEach(link => {
                // Verifica qual aba corresponde ao onclick do link
                const onclickAttr = link.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes(`'${aba}'`)) {
                    link.classList.add('active');
                }
            });
        }

        /* ==================== FIM DO CÓDIGO JAVASCRIPT ==================== */