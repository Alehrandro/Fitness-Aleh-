/* Disciplina Fit — banco de exercícios e treinos padrão */
(function () {
  'use strict';

  const GROUPS = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Pernas', 'Panturrilha', 'Abdômen'];

  // id, nome, grupo, séries, reps mín, reps máx, descanso (s), dica de execução, unidade
  const E = (id, name, group, sets, rmin, rmax, rest, tip, unit) =>
    ({ id, name, group, sets, rmin, rmax, rest, tip, unit: unit || 'rep' });

  const EXERCISES = [
    // Peito
    E('supino-reto', 'Supino Reto', 'Peito', 4, 8, 12, 90, 'Deite no banco, pés firmes no chão. Desça a barra até a linha do peito e empurre sem tirar o quadril do banco.'),
    E('supino-inclinado', 'Supino Inclinado', 'Peito', 4, 8, 12, 90, 'Banco entre 30° e 45°. Desça a barra controlando até a parte alta do peito e suba sem travar os cotovelos.'),
    E('supino-declinado', 'Supino Declinado', 'Peito', 3, 8, 12, 90, 'Banco declinado, escápulas juntas. Desça até a parte baixa do peito e empurre de forma contínua.'),
    E('supino-halteres', 'Supino com Halteres', 'Peito', 3, 10, 12, 75, 'Halteres na linha do peito, cotovelos a cerca de 45° do tronco. Suba juntando os halteres sem bater.'),
    E('crucifixo', 'Crucifixo com Halteres', 'Peito', 3, 10, 15, 60, 'Cotovelos levemente flexionados. Abra os braços até sentir o alongamento e feche como se abraçasse uma árvore.'),
    E('crossover', 'Crossover na Polia', 'Peito', 3, 12, 15, 60, 'Polias altas, tronco levemente inclinado. Traga as mãos à frente do corpo contraindo o peito.'),
    E('peck-deck', 'Peck Deck', 'Peito', 3, 12, 15, 60, 'Costas apoiadas no encosto. Feche os braços à frente sem projetar os ombros e volte devagar.'),
    E('flexao', 'Flexão de Braço', 'Peito', 3, 10, 15, 60, 'Corpo alinhado da cabeça aos calcanhares. Desça até o peito quase tocar o chão e empurre.'),

    // Costas
    E('puxada-frente', 'Puxada na Frente', 'Costas', 4, 8, 12, 75, 'Puxe a barra até a altura do queixo levando os cotovelos para baixo e para trás. Evite balançar o tronco.'),
    E('remada-curvada', 'Remada Curvada', 'Costas', 4, 8, 12, 90, 'Tronco inclinado com a coluna neutra. Leve a barra em direção ao abdômen e controle a descida.'),
    E('remada-baixa', 'Remada Baixa', 'Costas', 3, 10, 12, 75, 'Sentado, peito aberto. Puxe o triângulo até o abdômen aproximando as escápulas.'),
    E('remada-unilateral', 'Remada Unilateral', 'Costas', 3, 10, 12, 60, 'Apoie uma mão e o joelho no banco. Puxe o halter em direção ao quadril mantendo o tronco estável.'),
    E('barra-fixa', 'Barra Fixa', 'Costas', 3, 6, 10, 90, 'Pegada um pouco mais larga que os ombros. Suba até o queixo passar da barra e desça com controle.'),
    E('pulldown', 'Pulldown na Polia', 'Costas', 3, 12, 15, 60, 'Braços quase estendidos, polia alta. Empurre a barra para baixo usando as costas, sem flexionar muito os cotovelos.'),
    E('levantamento-terra', 'Levantamento Terra', 'Costas', 4, 6, 10, 120, 'Barra rente às pernas, coluna neutra. Empurre o chão com os pés e estenda quadril e joelhos juntos.'),

    // Ombros
    E('desenvolvimento', 'Desenvolvimento', 'Ombros', 4, 8, 12, 90, 'Halteres na altura das orelhas. Empurre para cima sem arquear a lombar e desça até a linha do queixo.'),
    E('elevacao-lateral', 'Elevação Lateral', 'Ombros', 3, 12, 15, 60, 'Cotovelos levemente flexionados. Suba os halteres até a altura dos ombros, sem balançar o corpo.'),
    E('elevacao-frontal', 'Elevação Frontal', 'Ombros', 3, 10, 12, 60, 'Suba o halter à frente até a altura dos olhos e desça devagar, mantendo o tronco parado.'),
    E('crucifixo-inverso', 'Crucifixo Inverso', 'Ombros', 3, 12, 15, 60, 'Tronco inclinado à frente. Abra os braços para os lados trabalhando a parte posterior do ombro.'),
    E('encolhimento', 'Encolhimento', 'Ombros', 3, 12, 15, 60, 'Segure os halteres ao lado do corpo e eleve os ombros em direção às orelhas, sem girar.'),
    E('arnold', 'Arnold Press', 'Ombros', 3, 10, 12, 75, 'Comece com as palmas para você e gire os punhos enquanto empurra os halteres para cima.'),

    // Bíceps
    E('rosca-direta', 'Rosca Direta', 'Bíceps', 3, 10, 12, 60, 'Cotovelos colados ao corpo. Suba a barra sem balançar o tronco e desça controlando até estender quase todo o braço.'),
    E('rosca-alternada', 'Rosca Alternada', 'Bíceps', 3, 10, 12, 60, 'Alterne os braços girando o punho durante a subida. Mantenha os cotovelos fixos.'),
    E('rosca-martelo', 'Rosca Martelo', 'Bíceps', 3, 10, 12, 60, 'Pegada neutra (palmas voltadas uma para a outra). Suba o halter sem mover o cotovelo.'),
    E('rosca-scott', 'Rosca Scott', 'Bíceps', 3, 10, 12, 60, 'Braços apoiados no banco Scott. Desça devagar até quase estender e suba sem tirar o cotovelo do apoio.'),
    E('rosca-concentrada', 'Rosca Concentrada', 'Bíceps', 3, 10, 12, 45, 'Sentado, cotovelo apoiado na parte interna da coxa. Suba o halter e aperte o bíceps no topo.'),

    // Tríceps
    E('triceps-polia', 'Tríceps na Polia', 'Tríceps', 3, 10, 15, 60, 'Cotovelos junto ao corpo. Estenda os braços para baixo e volte até 90° sem levantar os ombros.'),
    E('triceps-corda', 'Tríceps Corda', 'Tríceps', 3, 12, 15, 60, 'Ao final do movimento, abra a corda para os lados e contraia o tríceps. Cotovelos fixos.'),
    E('triceps-testa', 'Tríceps Testa', 'Tríceps', 3, 10, 12, 60, 'Deitado, desça a barra em direção à testa flexionando só os cotovelos e estenda de volta.'),
    E('triceps-frances', 'Tríceps Francês', 'Tríceps', 3, 10, 12, 60, 'Segure o halter com as duas mãos atrás da cabeça e estenda os braços sem abrir os cotovelos.'),
    E('mergulho', 'Mergulho no Banco', 'Tríceps', 3, 10, 15, 60, 'Mãos no banco atrás de você. Desça flexionando os cotovelos para trás e empurre de volta.'),

    // Pernas
    E('agachamento-livre', 'Agachamento Livre', 'Pernas', 4, 10, 12, 90, 'Pés na largura dos ombros, joelhos acompanhando os pés. Desça com a coluna neutra até as coxas ficarem paralelas ao chão.'),
    E('leg-press-45', 'Leg Press 45°', 'Pernas', 4, 12, 12, 90, 'Pés na largura dos ombros na plataforma. Desça até cerca de 90° nos joelhos e empurre sem travar as pernas.'),
    E('cadeira-extensora', 'Cadeira Extensora', 'Pernas', 3, 12, 15, 60, 'Ajuste o encosto para o joelho alinhar com o eixo. Estenda as pernas, segure 1 segundo e desça devagar.'),
    E('mesa-flexora', 'Mesa Flexora', 'Pernas', 3, 12, 15, 60, 'Deitado de bruços, flexione os joelhos levando o calcanhar em direção ao glúteo sem tirar o quadril do banco.'),
    E('afundo', 'Afundo', 'Pernas', 3, 10, 12, 75, 'Dê um passo à frente e desça até os dois joelhos formarem cerca de 90°. Empurre com o pé da frente para voltar.'),
    E('stiff', 'Stiff', 'Pernas', 3, 10, 12, 90, 'Joelhos levemente flexionados, empurre o quadril para trás deslizando a barra rente às pernas. Suba contraindo o glúteo.'),
    E('agachamento-bulgaro', 'Agachamento Búlgaro', 'Pernas', 3, 8, 12, 75, 'Pé de trás apoiado no banco. Desça o joelho de trás em direção ao chão com o tronco ereto.'),
    E('hack', 'Agachamento Hack', 'Pernas', 4, 10, 12, 90, 'Costas apoiadas no encosto. Desça até 90° nos joelhos e empurre pelo meio dos pés.'),
    E('cadeira-abdutora', 'Cadeira Abdutora', 'Pernas', 3, 12, 15, 60, 'Abra as pernas contra a resistência mantendo o tronco apoiado e volte devagar.'),
    E('elevacao-pelvica', 'Elevação Pélvica', 'Pernas', 4, 10, 12, 75, 'Costas apoiadas no banco, barra sobre o quadril. Suba até o tronco alinhar com as coxas e contraia o glúteo.'),

    // Panturrilha
    E('panturrilha-pe', 'Panturrilha em Pé', 'Panturrilha', 4, 15, 20, 45, 'Suba na ponta dos pés o máximo possível, segure 1 segundo e desça alongando bem a panturrilha.'),
    E('panturrilha-sentado', 'Panturrilha Sentado', 'Panturrilha', 4, 15, 20, 45, 'Joelhos a 90°, peso sobre as coxas. Suba e desça com amplitude total, sem quicar.'),
    E('panturrilha-leg', 'Panturrilha no Leg Press', 'Panturrilha', 3, 15, 20, 45, 'Apenas a ponta dos pés na plataforma. Empurre estendendo os tornozelos e volte alongando.'),

    // Abdômen
    E('abdominal-crunch', 'Abdominal Crunch', 'Abdômen', 3, 15, 20, 45, 'Deitado, joelhos flexionados. Suba apenas os ombros contraindo o abdômen, sem puxar o pescoço.'),
    E('prancha', 'Prancha', 'Abdômen', 3, 30, 60, 45, 'Apoie antebraços e pontas dos pés, corpo reto. Mantenha o abdômen contraído pelo tempo indicado (em segundos).', 's'),
    E('elevacao-pernas', 'Elevação de Pernas', 'Abdômen', 3, 12, 15, 45, 'Deitado ou na barra, suba as pernas estendidas até 90° e desça sem encostar no chão.'),
    E('abdominal-obliquo', 'Abdominal Oblíquo', 'Abdômen', 3, 12, 20, 45, 'Leve o cotovelo em direção ao joelho oposto alternando os lados, com movimento controlado.'),
    E('roda-abdominal', 'Roda Abdominal', 'Abdômen', 3, 8, 12, 60, 'De joelhos, role a roda à frente mantendo o abdômen firme e volte sem arquear a lombar.')
  ];

  const MAP = {};
  EXERCISES.forEach((e) => { MAP[e.id] = e; });

  const DEFAULT_CFG = { setsMin: 3, setsMax: 6, repsMin: 8, repsMax: 15, restMin: 30, restMax: 90 };

  const item = (id, o) => {
    const e = MAP[id];
    return Object.assign({ id: id, sets: e.sets, repsMin: e.rmin, repsMax: e.rmax, rest: e.rest }, o || {});
  };

  function seedWorkouts() {
    const mk = (id, name, groups, ids) => ({
      id: id, name: name, groups: groups, cfg: Object.assign({}, DEFAULT_CFG), items: ids.map((i) => item(i))
    });
    return [
      mk('w-membros-pernas', 'Membros + Pernas', ['Pernas', 'Panturrilha', 'Bíceps'],
        ['agachamento-livre', 'leg-press-45', 'cadeira-extensora', 'mesa-flexora', 'panturrilha-pe', 'rosca-direta']),
      mk('w-superior', 'Superior', ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'],
        ['supino-reto', 'puxada-frente', 'desenvolvimento', 'remada-baixa', 'triceps-polia', 'rosca-direta']),
      mk('w-inferior', 'Inferior', ['Pernas', 'Panturrilha'],
        ['agachamento-livre', 'leg-press-45', 'mesa-flexora', 'elevacao-pelvica', 'panturrilha-pe']),
      mk('w-full-body', 'Full Body', ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Pernas', 'Panturrilha', 'Abdômen'],
        ['agachamento-livre', 'supino-reto', 'remada-curvada', 'desenvolvimento', 'rosca-direta', 'triceps-polia', 'prancha', 'panturrilha-pe']),
      mk('w-personalizado', 'Personalizado', ['Peito', 'Pernas', 'Costas', 'Abdômen'],
        ['flexao', 'afundo', 'remada-unilateral', 'abdominal-crunch'])
    ];
  }

  window.DF = { GROUPS: GROUPS, EXERCISES: EXERCISES, MAP: MAP, DEFAULT_CFG: DEFAULT_CFG, seedWorkouts: seedWorkouts };
})();
