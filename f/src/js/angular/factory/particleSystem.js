'use strict';

/**
 * Класс реализации поведения одной частицы в системе
 * @param {CanvasRenderingContext2D} canvasCtx - контекст канваса, в котором реализуем частицы
 * @param {Array} arColor - массив цветов частиц, в стандартной реализации частицы созданы с помощью Arc c тенью
 * при желании можно заменить картинками или другими фигурами
 * @param {Array} arType - массив типов частиц, определяет png частицы (Альтернатива цвету)
 * @param {obj} canvasParam - исходные парметры канваса(вьюпорта)
 * @param {number} index - переменная хранит ID частицы, по которому можно отследить ее параметры и движение
 * @param {number} imgs - Объект с html элементами картинок
 * @constructor
 */
var particle = function (canvasCtx, arColor, arType, canvasParam, index, imgs) {
	/**
	 * цвет частицы
	 * @type {string}
	 */
	this.color = arColor[Math.floor(Math.random() * arColor.length)];

	/**
	 * тип частины
	 * @type {string}
	 */
	this.type = (index < 100) ? arType[Math.floor(Math.random() * arType.length)] : arType[2];


	this._images = imgs;


	/**
	 * @type {obj}
	 */
	this.canvasParam = canvasParam;

	/**
	 * @type {CanvasRenderingContext2D}
	 */
	this.canvasCtx = canvasCtx;
	if (!this.canvasCtx) return;

	/**
	 * Стартовая позиция по X, по умолчанию рандом
	 * @type {number}
	 */
	this.positionX = parseInt(Math.random() * this.canvasParam.width, 10);

	/**
	 * Стартовая позиция по Y, по умолчанию рандом
	 * @type {number}
	 */
	this.positionY  = parseInt(Math.random() * this.canvasParam.height, 10);

	/**
	 * Скорость движения
	 * @type {number}
	 */
	this.speed = Math.random() * 0.1;

	/**
	 * Ширина частицы (для прямоугольников)
	 * @type {number}
	 */
	this.width = 0;

	/**
	 * Высота частицы (для прямоугольников)
	 * @type {number}
	 */
	this.height = 0;

	/**
	 * Радиус частицы (для Arc)
	 * @type {number}
	 */
	this.radius = Math.random() * 7;

	/**
	 * Угол движения
	 * @type {number}
	 */
	this.angle = (1 + 2 * Math.random()) * Math.PI / 2;

	/**
	 * Длина вектора от центра
	 * @type {{}}
	 */
	this.vectorEndActivity = {};

	/**
	 * @type {number}
	 */
	this.alphaLimit = Math.random();

	/**
	 * @type {number}
	 */
	this.alpha = 0;

	/**
	 * @type {number}
	 */
	this.alphaDir = 1;

	/**
	 * @type {boolean}
	 */
	this.easingRepulse = true;

	this._init();
};

/**
 * @private
 */
particle.prototype._init = function () {
	this.radius = 0;
	this.width = this._randomInteger(20, 40);
};

/**
 * Устанавливаем новые случайные параметры частицы
 * Используется при ресайзе
 */
particle.prototype.setPosition = function () {
	this.positionX = parseInt(Math.random() * this.canvasParam.width, 10);
	this.positionY  = parseInt(Math.random() * this.canvasParam.height, 10);
	this.speed = Math.random() * 0.1;
	this.width = this._randomInteger(8, 40);
	this.height = Math.random() * 2 + 2;
	this.radius = Math.random() * 7;
	this.angle = (1 + 2 * Math.random()) * Math.PI / 2;
	this._render();
};


/**
 * Отрисовка нового кадра
 * @private
 */
particle.prototype._render = function () {
	this.canvasCtx.beginPath();
	this.canvasCtx.globalAlpha = this.alpha;
	this.canvasCtx.drawImage(this._images[this.type], this.positionX, this.positionY, this.width, this.width);
	this.canvasCtx.closePath();
};

//particle.prototype._render = function () {
//	this.canvasCtx.beginPath();
//	this.canvasCtx.fillStyle = this.color;
//	this.canvasCtx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI*2, true);
//	this.canvasCtx.shadowColor = this.color;
//	this.canvasCtx.shadowBlur = 10;
//	this.canvasCtx.fill();
//	this.canvasCtx.closePath();
//};



/**
 * Анимация "движения частиц в пространстве"
 */
particle.prototype.animate = function () {
	this.positionX+= this.speed * Math.cos(this.angle-(Math.PI/2));
	this.positionY+= this.speed * Math.sin(this.angle-(Math.PI/2));

	this.alpha+=(0.005 * this.alphaDir);

	if (this.alpha >1) {
		this.alpha = 1;
		this.alphaDir = -1;
	}

	if (this.alpha <= this.alphaLimit) {
		this.alphaDir = 1;
		this.alpha = this.alphaLimit;
	}
	this._render();
};

/**
 * @param min
 * @param max
 * @returns {*}
 * @private
 */
particle.prototype._randomInteger = function (min, max) {
	var rand = min + Math.random() * (max - min)
	rand = Math.round(rand);
	return rand;
};

/**
 * Фиксируем последние координаты "перемещения" перед анимацией
 * Записываем длину вектора
 */
particle.prototype.fixPosition = function () {

	this.vectorEndActivity = {
		'ax': 0,
		'ay': 0,
		'bx': this.positionX - this.canvasParam.width/2,
		'by': this.positionY - this.canvasParam.height/2,
		'length': 0,
		'endX': this.positionX,
		'endY': this.positionY
	};

	this.vectorEndActivity.length
		= Math.sqrt(Math.pow(Math.abs(this.vectorEndActivity.bx), 2) + Math.pow(Math.abs(this.vectorEndActivity.by), 2));
};

/**
 * Анимация взрыва
 * @param {int} radius - параметр текущего положения волны взрыва
 * как только радиус равен длине вектора от цента к последней координате частины,
 * начинаем движение частицы в сторону
 */
particle.prototype.animateRePulse = function (radius) {
	this.radius = radius;

	if (this.radius == 0) return;

	if (!this.timeStartRepulse) {
		this.timeStartRepulse = window.performance.now();
	}

	if (this.vectorEndActivity.endX > this.canvasParam.width/2) {
		this.positionX = radius + this.vectorEndActivity.endX;
	} else {
		this.positionX = this.vectorEndActivity.endX - radius;
	}

	if (this.vectorEndActivity.endY > this.canvasParam.height/2) {
		this.positionY =  this.vectorEndActivity.endY+ radius;
	} else {
		this.positionY = this.vectorEndActivity.endY - radius;
	}

	var paramScale = Math.random();
	this.positionY = parseInt(this.positionY, 10);
	this.positionX = parseInt(this.positionX, 10);

	if (this.easingRepulse) {
		var t = window.performance.now() - this.timeStartRepulse;
		this.positionX+= Math.easeInOutQuart(1, t, 0, 2, 1000);
		this.positionY+= Math.easeInOutQuart(1, t, 0, 2, 1000);
	}

	this.width+=paramScale;
	this.height+=paramScale;

	this.alpha-=0.02;

	if (this.alpha >= 0) {
		this._render();
	}

};

/**
 * Анимация "схлопывания" частиц
 */
particle.prototype.animateDestroy = function () {
	this.radius-= 1;

	if (this.radius > 0) {
		this.width = this.radius;
		this._render();
	}

};

/**
 * Анимация "рассхлопывания" частиц
 */
particle.prototype.animateShow = function () {
	this.positionX+= this.speed * Math.cos(this.angle-(Math.PI/2));
	this.positionY+= this.speed * Math.sin(this.angle-(Math.PI/2));

	this.alpha+=(0.02);

	if (this.alpha > 1) {
		this.alpha = 1;
		this.alphaDir = -1;
	} else {
		this._render();
	}

};

/** for angular **/

/**
 * Фабрика обрабатывающая анимацию и хранящая объекты частиц
 */
app.factory('particleCloud', function( $timeout, $rootScope, $window, $q, $log) {

		/**
		 * Объект фабрики
		 */
		var ParticleCloud = function (canvas) {

			/**
			 * Канвас
			 */
			this.canvas = canvas;
			if (!this.canvas) return;

			/**
			 * @type {{circle_green: *, circle_red: *, circle_white: *}}
			 */
			this.img = {
				'circle_green': new Image(),
				'circle_red': new Image(),
				'circle_white': new Image()
			};

			/**
			 * Контекст
			 * @type {CanvasRenderingContext2D}
			 */
			this.canvasCtx = canvas.getContext('2d');

			/**
			 * Параметры вьюпорта
			 * @type {{width: number, height: number}}
			 */
			this.canvasParam = {
				'width': canvas.clientWidth,
				'height': canvas.clientHeight
			};

			/**
			 * Массив цветов частиц
			 * @type {string[]}
			 */
			this.arColor = ['#cd3933', '#fff', '#6bcd2c'];

			/**
			 * @type {string[]}
			 */
			this.arType = ['circle_green', 'circle_red', 'circle_white'];

			/**
			 * Вспомогательная переменная радиуса для анимации волны
			 * @type {number}
			 */
			this.radiusPulse = 0;

			/**
			 * Переменная для хранения id requestAnimationFrame
			 * @type {number}
			 */
			this.animateId = 0;

			/**
			 * Общее количество частиц
			 * @type {number}
			 */
			this.countParticles = 50;

			/**
			 * Объект дял хранения объектов частиц
			 * @type {{}}
			 */
			this.particles = {};

			/**
			 * Вспомогательная переменная, счетчик
			 * @type {number}
			 * @private
			 */
			this._counter = 0;

			/**
			 * Вспомогательная переменная для хранения дефферед объектов
			 * @private
			 */
			this._deffered = null;

			/**
			 * @type {boolean}
			 * @private
			 */
			this._repulse = false;

			this.init();
		};


		ParticleCloud.prototype = {

			/**
			 * Public methods
			 */
			init: function () {
				$log.debug('instance particle factory');
				/**
				 * @type {ParticleCloud}
				 */
				var that = this;

				this.img.circle_green.src = 'f/media/global/particle/circle_green.png';
				this.img.circle_white.src = 'f/media/global/particle/circle_white.png';
				this.img.circle_red.src = 'f/media/global/particle//circle_red.png';

				/**
				 * Инстанс после загрузки DOM и ангуляра
				 */
				$timeout(function () {
					that._onResize();

					for (var i = 0; i < that.countParticles; i++) {
						that.particles[i] = new particle(
							that.canvasCtx, that.arColor, that.arType, that.canvasParam, i, that.img);
					}

					/**
					 * Вешаем событие на ресайз
					 */
					angular.element($window).bind('resize', function() {
						that._onResize();
					});

				});
			},

			/**
			 *	Перестройка частиц
			 */
			reGather: function () {
				if (this._repulse) return;

				this.canvasCtx.clearRect(0, 0,
					this.canvasParam.width, this.canvasParam.height);

				for (var n in this.particles){
					this.particles[n].canvasParam.width = this.canvasParam.width;
					this.particles[n].canvasParam.height = this.canvasParam.height;
					this.particles[n].setPosition();
				}
			},

			/**
			 * Запуск "плавания"
			 */
			startDraw: function () {
				if (this.animateId)
					cancelAnimationFrame(this.animateId);
				this.animateId = requestAnimationFrame(angular.bind(this, this.animateDraw));
			},

			/**
			 * Стопим "плавание"
			 */
			stopDraw: function () {
				if (this.animateId)
					cancelAnimationFrame(this.animateId);
			},

			/**
			 *	Показываем все частицы
			 */
			showAll: function () {
				if (this.animateId)
					cancelAnimationFrame(this.animateId);
				this.animateId = 0;
				this._counter = 0;
				this._deffered = $q.defer();
				this.animateId = requestAnimationFrame(angular.bind(this, this.animateShow));
				return this._deffered.promise;
			},

			/**
			 *	Убираем все частицы
			 */
			destroyAll: function () {
				if (this.animateId)
					cancelAnimationFrame(this.animateId);
				this.animateId = 0;
				this._counter = 40;
				this._deffered = $q.defer();
				this.animateId = requestAnimationFrame(angular.bind(this, this.animateDestroy));
				return this._deffered.promise;
			},

			/**
			 * Устраиваем взрыв, разгоняем частицы
			 */
			repulse: function () {
				this._defferedRepulse = $q.defer();
				if (this.animateId)
					cancelAnimationFrame(this.animateId);
				this.animateId = 0;

				for (var n in this.particles) {
					/**
					 * Фиксируем вектора для взрыва
					 */
					this.particles[n].fixPosition();
				}

				this._radiusMax
					= Math.sqrt(Math.pow(this.canvasParam.width/2, 2) + Math.pow(this.canvasParam.height/2, 2));

				this.animateRepulseId = requestAnimationFrame(angular.bind(this, this.animateRePulse));

				return this._defferedRepulse.promise;
			},

			/**
			 * Анимируем бесконечное движение
			 */
			animateDraw: function () {
				var that = this;
				this.canvasCtx.clearRect(0, 0,
					this.canvasParam.width, this.canvasParam.height);

				for (var n in this.particles){
					this.particles[n].animate();
				}

				that.animateId = requestAnimationFrame(angular.bind(that, that.animateDraw));
			},

			/**
			 * Анимируем появление частиц
			 */
			animateShow: function () {
				this.canvasCtx.clearRect(0, 0,
					this.canvasParam.width, this.canvasParam.height);

				this._counter++;

				for (var n in this.particles){
					this.particles[n].animateShow(this._counter);
				}

				if (this._counter < 50) {
					this.animateId = requestAnimationFrame(angular.bind(this, this.animateShow));
				} else {
					this._deffered.resolve();
					if (this.animateId)
						cancelAnimationFrame(this.animateId);
				}
			},

			/**
			 * Анимируем "уход" частиц
			 */
			animateDestroy: function () {
				this.canvasCtx.clearRect(0, 0,
					this.canvasParam.width, this.canvasParam.height);
				this._counter--;
				for (var n in this.particles){
					this.particles[n].animateDestroy();
				}

				if (this._counter > 0) {
					this.animateId = requestAnimationFrame(angular.bind(this, this.animateDestroy));
				} else {
					this._deffered.resolve();
					if (this.animateId)
						cancelAnimationFrame(this.animateId);
				}
			},

			/**
			 * Анимируем взрыв частиц от центра
			 */
			animateRePulse: function () {
				this.canvasCtx.clearRect(0, 0,
					this.canvasParam.width, this.canvasParam.height);

				for (var n in this.particles){
					this.particles[n].animateRePulse(this.radiusPulse);
				}

				/**
				 * Если волна дошла до конца окна, останавливаем
				 */
				if (this._radiusMax <= this.radiusPulse) {
					if (this.animateRepulseId)
						cancelAnimationFrame(this.animateRepulseId);
					this.animateId = 0;
					this.canvasCtx.clearRect(0, 0,
						this.canvasParam.width, this.canvasParam.height);

					this._defferedRepulse.resolve();
					this._repulse = true;

				} else {
					this.radiusPulse+= parseInt((this._radiusMax / 50), 10);
					this.animateRepulseId = requestAnimationFrame(angular.bind(this, this.animateRePulse));
				}
			},

			/**
			 * @private
			 */
			_onResize: function () {
				this.canvasParam = {
					'width': window.innerWidth,
					'height': window.innerHeight
				};

				this.canvas.width = this.canvasParam.width;
				this.canvas.height = this.canvasParam.height;
				this.reGather();
			}
		};

		return ( ParticleCloud );
	}
);