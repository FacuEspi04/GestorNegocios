/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(5);
const serve_static_1 = __webpack_require__(6);
const path_1 = __webpack_require__(7);
const articulo_entity_1 = __webpack_require__(8);
const categoria_entity_1 = __webpack_require__(9);
const cliente_entity_1 = __webpack_require__(17);
const marca_entity_1 = __webpack_require__(11);
const pedido_entity_1 = __webpack_require__(13);
const proveedores_entity_1 = __webpack_require__(14);
const retiro_entity_1 = __webpack_require__(18);
const venta_detalle_entity_1 = __webpack_require__(15);
const venta_entity_1 = __webpack_require__(16);
const pedido_detalle_entity_1 = __webpack_require__(12);
const app_service_1 = __webpack_require__(20);
const articulos_module_1 = __webpack_require__(21);
const categorias_module_1 = __webpack_require__(27);
const proveedores_module_1 = __webpack_require__(33);
const pedidos_module_1 = __webpack_require__(37);
const ventas_module_1 = __webpack_require__(43);
const clientes_module_1 = __webpack_require__(48);
const retiros_module_1 = __webpack_require__(53);
const marcas_module_1 = __webpack_require__(57);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: process.env.DB_PATH || (0, path_1.join)(process.cwd(), 'dietetica.db'),
                entities: [
                    articulo_entity_1.Articulo,
                    categoria_entity_1.Categoria,
                    marca_entity_1.Marca,
                    proveedores_entity_1.Proveedor,
                    pedido_entity_1.Pedido,
                    pedido_detalle_entity_1.PedidoDetalle,
                    venta_entity_1.Venta,
                    venta_detalle_entity_1.VentaDetalle,
                    cliente_entity_1.Cliente,
                    retiro_entity_1.Retiro,
                ],
                synchronize: true,
            }),
            articulos_module_1.ArticulosModule,
            categorias_module_1.CategoriasModule,
            proveedores_module_1.ProveedoresModule,
            pedidos_module_1.PedidosModule,
            ventas_module_1.VentasModule,
            clientes_module_1.ClientesModule,
            retiros_module_1.RetirosModule,
            marcas_module_1.MarcasModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
        ],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Articulo = void 0;
const categoria_entity_1 = __webpack_require__(9);
const marca_entity_1 = __webpack_require__(11);
const pedido_detalle_entity_1 = __webpack_require__(12);
const venta_detalle_entity_1 = __webpack_require__(15);
const typeorm_1 = __webpack_require__(10);
let Articulo = class Articulo {
    id;
    nombre;
    codigo_barras;
    precio;
    stock;
    stock_minimo;
    esPesable;
    categoriaId;
    categoria;
    marcaId;
    marca;
    activo;
    createdAt;
    updatedAt;
    itemsVenta;
    itemsPedido;
};
exports.Articulo = Articulo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Articulo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Articulo.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo_barras', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Articulo.prototype, "codigo_barras", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_minimo', type: 'decimal', precision: 10, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "stock_minimo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'es_pesable', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Articulo.prototype, "esPesable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'categoria_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], Articulo.prototype, "categoriaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria, {
        eager: true,
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'categoria_id' }),
    __metadata("design:type", Object)
], Articulo.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'marca_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], Articulo.prototype, "marcaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => marca_entity_1.Marca, {
        eager: true,
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'marca_id' }),
    __metadata("design:type", Object)
], Articulo.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Articulo.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Articulo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Articulo.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => venta_detalle_entity_1.VentaDetalle, (detalle) => detalle.articulo),
    __metadata("design:type", Array)
], Articulo.prototype, "itemsVenta", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pedido_detalle_entity_1.PedidoDetalle, (detalle) => detalle.articulo),
    __metadata("design:type", Array)
], Articulo.prototype, "itemsPedido", void 0);
exports.Articulo = Articulo = __decorate([
    (0, typeorm_1.Entity)({ name: 'articulos' })
], Articulo);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Categoria = void 0;
const typeorm_1 = __webpack_require__(10);
let Categoria = class Categoria {
    id;
    nombre;
};
exports.Categoria = Categoria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Categoria.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, nullable: false }),
    __metadata("design:type", String)
], Categoria.prototype, "nombre", void 0);
exports.Categoria = Categoria = __decorate([
    (0, typeorm_1.Entity)({ name: 'categorias' })
], Categoria);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Marca = void 0;
const typeorm_1 = __webpack_require__(10);
let Marca = class Marca {
    id;
    nombre;
};
exports.Marca = Marca;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Marca.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, nullable: false }),
    __metadata("design:type", String)
], Marca.prototype, "nombre", void 0);
exports.Marca = Marca = __decorate([
    (0, typeorm_1.Entity)({ name: 'marcas' })
], Marca);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PedidoDetalle = void 0;
const typeorm_1 = __webpack_require__(10);
const pedido_entity_1 = __webpack_require__(13);
const articulo_entity_1 = __webpack_require__(8);
let PedidoDetalle = class PedidoDetalle {
    id;
    pedidoId;
    articuloId;
    cantidad;
    precioUnitario;
    subtotal;
    pedido;
    articulo;
};
exports.PedidoDetalle = PedidoDetalle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PedidoDetalle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pedido_id', type: 'integer' }),
    __metadata("design:type", Number)
], PedidoDetalle.prototype, "pedidoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'articulo_id', type: 'integer' }),
    __metadata("design:type", Number)
], PedidoDetalle.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], PedidoDetalle.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PedidoDetalle.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PedidoDetalle.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pedido_entity_1.Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pedido_id' }),
    __metadata("design:type", typeof (_a = typeof pedido_entity_1.Pedido !== "undefined" && pedido_entity_1.Pedido) === "function" ? _a : Object)
], PedidoDetalle.prototype, "pedido", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo, { eager: true, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'articulo_id' }),
    __metadata("design:type", typeof (_b = typeof articulo_entity_1.Articulo !== "undefined" && articulo_entity_1.Articulo) === "function" ? _b : Object)
], PedidoDetalle.prototype, "articulo", void 0);
exports.PedidoDetalle = PedidoDetalle = __decorate([
    (0, typeorm_1.Entity)({ name: 'pedido_detalles' })
], PedidoDetalle);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pedido = void 0;
const typeorm_1 = __webpack_require__(10);
const pedido_detalle_entity_1 = __webpack_require__(12);
const proveedores_entity_1 = __webpack_require__(14);
let Pedido = class Pedido {
    id;
    proveedorId;
    fechaPedido;
    estado;
    total;
    notas;
    createdAt;
    proveedor;
    items;
};
exports.Pedido = Pedido;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pedido.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'proveedor_id', type: 'integer' }),
    __metadata("design:type", Number)
], Pedido.prototype, "proveedorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_pedido', type: 'date' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Pedido.prototype, "fechaPedido", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: ['Borrador', 'Pendiente', 'En_Transito', 'Recibido', 'Cancelado'],
        default: 'Pendiente',
    }),
    __metadata("design:type", String)
], Pedido.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Pedido.prototype, "notas", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Pedido.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proveedores_entity_1.Proveedor, (p) => p.pedidos, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'proveedor_id' }),
    __metadata("design:type", typeof (_c = typeof proveedores_entity_1.Proveedor !== "undefined" && proveedores_entity_1.Proveedor) === "function" ? _c : Object)
], Pedido.prototype, "proveedor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pedido_detalle_entity_1.PedidoDetalle, (detalle) => detalle.pedido, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Pedido.prototype, "items", void 0);
exports.Pedido = Pedido = __decorate([
    (0, typeorm_1.Entity)({ name: 'pedidos' })
], Pedido);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Proveedor = void 0;
const pedido_entity_1 = __webpack_require__(13);
const typeorm_1 = __webpack_require__(10);
let Proveedor = class Proveedor {
    id;
    nombre;
    contacto;
    telefono;
    email;
    direccion;
    cuit;
    notas;
    activo;
    createdAt;
    pedidos;
};
exports.Proveedor = Proveedor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proveedor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Proveedor.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Proveedor.prototype, "contacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Proveedor.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Proveedor.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Proveedor.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, nullable: true }),
    __metadata("design:type", Object)
], Proveedor.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Proveedor.prototype, "notas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Proveedor.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Proveedor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pedido_entity_1.Pedido, (pedido) => pedido.proveedor),
    __metadata("design:type", Array)
], Proveedor.prototype, "pedidos", void 0);
exports.Proveedor = Proveedor = __decorate([
    (0, typeorm_1.Entity)({ name: 'proveedores' })
], Proveedor);


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VentaDetalle = void 0;
const typeorm_1 = __webpack_require__(10);
const venta_entity_1 = __webpack_require__(16);
const articulo_entity_1 = __webpack_require__(8);
let VentaDetalle = class VentaDetalle {
    id;
    numeroVenta;
    venta;
    articuloId;
    articulo;
    cantidad;
    precioUnitario;
    subtotal;
};
exports.VentaDetalle = VentaDetalle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VentaDetalle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_venta', type: 'integer' }),
    __metadata("design:type", Number)
], VentaDetalle.prototype, "numeroVenta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, (venta) => venta.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'numero_venta' }),
    __metadata("design:type", typeof (_a = typeof venta_entity_1.Venta !== "undefined" && venta_entity_1.Venta) === "function" ? _a : Object)
], VentaDetalle.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'articulo_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], VentaDetalle.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo, { onDelete: 'SET NULL', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'articulo_id' }),
    __metadata("design:type", typeof (_b = typeof articulo_entity_1.Articulo !== "undefined" && articulo_entity_1.Articulo) === "function" ? _b : Object)
], VentaDetalle.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], VentaDetalle.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], VentaDetalle.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], VentaDetalle.prototype, "subtotal", void 0);
exports.VentaDetalle = VentaDetalle = __decorate([
    (0, typeorm_1.Entity)({ name: 'venta_detalles' })
], VentaDetalle);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Venta = exports.TurnoVenta = exports.VentaEstado = exports.FormaPago = void 0;
const typeorm_1 = __webpack_require__(10);
const venta_detalle_entity_1 = __webpack_require__(15);
const cliente_entity_1 = __webpack_require__(17);
var FormaPago;
(function (FormaPago) {
    FormaPago["EFECTIVO"] = "efectivo";
    FormaPago["DEBITO"] = "debito";
    FormaPago["CREDITO"] = "credito";
    FormaPago["TRANSFERENCIA"] = "transferencia";
})(FormaPago || (exports.FormaPago = FormaPago = {}));
var VentaEstado;
(function (VentaEstado) {
    VentaEstado["COMPLETADA"] = "Completada";
    VentaEstado["PENDIENTE"] = "Pendiente";
})(VentaEstado || (exports.VentaEstado = VentaEstado = {}));
var TurnoVenta;
(function (TurnoVenta) {
    TurnoVenta["MANANA"] = "ma\u00F1ana";
    TurnoVenta["TARDE"] = "tarde";
    TurnoVenta["FUERA"] = "fuera";
})(TurnoVenta || (exports.TurnoVenta = TurnoVenta = {}));
let Venta = class Venta {
    id;
    numeroVenta;
    fechaHora;
    clienteId;
    cliente;
    clienteNombre;
    items;
    subtotal;
    interes;
    total;
    monto_pagado;
    formaPago;
    estado;
    turno;
    createdAt;
    updatedAt;
};
exports.Venta = Venta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Venta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', unique: true }),
    __metadata("design:type", Number)
], Venta.prototype, "numeroVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Venta.prototype, "fechaHora", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cliente_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], Venta.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cliente_id' }),
    __metadata("design:type", typeof (_b = typeof cliente_entity_1.Cliente !== "undefined" && cliente_entity_1.Cliente) === "function" ? _b : Object)
], Venta.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Venta.prototype, "clienteNombre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => venta_detalle_entity_1.VentaDetalle, (detalle) => detalle.venta, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Venta.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Venta.prototype, "interes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Venta.prototype, "monto_pagado", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: FormaPago,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Venta.prototype, "formaPago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: VentaEstado,
    }),
    __metadata("design:type", String)
], Venta.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: TurnoVenta,
    }),
    __metadata("design:type", String)
], Venta.prototype, "turno", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Venta.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Venta.prototype, "updatedAt", void 0);
exports.Venta = Venta = __decorate([
    (0, typeorm_1.Entity)({ name: 'ventas' })
], Venta);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cliente = void 0;
const typeorm_1 = __webpack_require__(10);
let Cliente = class Cliente {
    id;
    nombre;
    telefono;
    email;
    direccion;
    limiteCredito;
    createdAt;
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cliente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Cliente.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'limite_credito',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Cliente.prototype, "limiteCredito", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Cliente.prototype, "createdAt", void 0);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)({ name: 'clientes' })
], Cliente);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Retiro = void 0;
const turnos_util_1 = __webpack_require__(19);
const typeorm_1 = __webpack_require__(10);
let Retiro = class Retiro {
    id;
    fechaHora;
    monto;
    motivo;
    formaPago;
    turno;
    createdAt;
};
exports.Retiro = Retiro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Retiro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Retiro.prototype, "fechaHora", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Retiro.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Retiro.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'Efectivo' }),
    __metadata("design:type", String)
], Retiro.prototype, "formaPago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: turnos_util_1.TurnoVenta,
    }),
    __metadata("design:type", typeof (_b = typeof turnos_util_1.TurnoVenta !== "undefined" && turnos_util_1.TurnoVenta) === "function" ? _b : Object)
], Retiro.prototype, "turno", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Retiro.prototype, "createdAt", void 0);
exports.Retiro = Retiro = __decorate([
    (0, typeorm_1.Entity)({ name: 'retiros' })
], Retiro);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.determinarTurno = exports.TurnoVenta = void 0;
var TurnoVenta;
(function (TurnoVenta) {
    TurnoVenta["MANANA"] = "ma\u00F1ana";
    TurnoVenta["TARDE"] = "tarde";
    TurnoVenta["FUERA"] = "fuera";
})(TurnoVenta || (exports.TurnoVenta = TurnoVenta = {}));
const determinarTurno = (fecha) => {
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const tiempoEnMinutos = hora * 60 + minutos;
    if (tiempoEnMinutos >= 510 && tiempoEnMinutos <= 810)
        return TurnoVenta.MANANA;
    if (tiempoEnMinutos >= 990 && tiempoEnMinutos <= 1290)
        return TurnoVenta.TARDE;
    return TurnoVenta.FUERA;
};
exports.determinarTurno = determinarTurno;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArticulosModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const articulos_service_1 = __webpack_require__(22);
const articulos_controller_1 = __webpack_require__(23);
const articulo_entity_1 = __webpack_require__(8);
let ArticulosModule = class ArticulosModule {
};
exports.ArticulosModule = ArticulosModule;
exports.ArticulosModule = ArticulosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([articulo_entity_1.Articulo])],
        controllers: [articulos_controller_1.ArticulosController],
        providers: [articulos_service_1.ArticulosService],
    })
], ArticulosModule);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArticulosService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(10);
const articulo_entity_1 = __webpack_require__(8);
let ArticulosService = class ArticulosService {
    articuloRepository;
    constructor(articuloRepository) {
        this.articuloRepository = articuloRepository;
    }
    create(createArticuloDto) {
        const { categoriaId, marcaId, ...rest } = createArticuloDto;
        const nuevoArticulo = this.articuloRepository.create({
            ...rest,
            categoria: { id: categoriaId },
            marca: marcaId ? { id: marcaId } : null,
        });
        return this.articuloRepository.save(nuevoArticulo);
    }
    async findAll(search) {
        const options = [];
        if (search) {
            const likeQuery = (0, typeorm_2.Like)(`%${search}%`);
            options.push({ nombre: likeQuery }, { codigo_barras: likeQuery }, { marca: { nombre: likeQuery } }, { categoria: { nombre: likeQuery } });
        }
        return this.articuloRepository.find({
            where: options.length > 0 ? options : undefined,
            relations: ['categoria', 'marca'],
            order: { nombre: 'ASC' },
        });
    }
    async findOne(id) {
        const articulo = await this.articuloRepository.findOne({
            where: { id },
            relations: ['categoria', 'marca'],
        });
        if (!articulo) {
            throw new common_1.NotFoundException(`Artículo con ID #${id} no encontrado.`);
        }
        return articulo;
    }
    async update(id, updateArticuloDto) {
        const articulo = await this.articuloRepository.findOneBy({ id });
        if (!articulo) {
            throw new common_1.NotFoundException(`Artículo con ID #${id} no encontrado.`);
        }
        const { categoriaId, marcaId, ...rest } = updateArticuloDto;
        this.articuloRepository.merge(articulo, rest);
        if (categoriaId) {
            articulo.categoria = { id: categoriaId };
        }
        if (marcaId) {
            articulo.marca = { id: marcaId };
        }
        else if (updateArticuloDto.hasOwnProperty('marcaId')) {
            articulo.marca = null;
        }
        return this.articuloRepository.save(articulo);
    }
    async remove(id) {
        const articulo = await this.findOne(id);
        await this.articuloRepository.remove(articulo);
        return { message: `Artículo con ID #${id} eliminado.` };
    }
};
exports.ArticulosService = ArticulosService;
exports.ArticulosService = ArticulosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ArticulosService);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArticulosController = void 0;
const common_1 = __webpack_require__(3);
const articulos_service_1 = __webpack_require__(22);
const create_articulo_dto_1 = __webpack_require__(24);
const update_articulo_dto_1 = __webpack_require__(26);
let ArticulosController = class ArticulosController {
    articulosService;
    constructor(articulosService) {
        this.articulosService = articulosService;
    }
    create(createArticuloDto) {
        return this.articulosService.create(createArticuloDto);
    }
    findAll(searchTerm) {
        return this.articulosService.findAll(searchTerm);
    }
    findOne(id) {
        return this.articulosService.findOne(id);
    }
    update(id, updateArticuloDto) {
        return this.articulosService.update(id, updateArticuloDto);
    }
    remove(id) {
        return this.articulosService.remove(id);
    }
};
exports.ArticulosController = ArticulosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_articulo_dto_1.CreateArticuloDto !== "undefined" && create_articulo_dto_1.CreateArticuloDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof update_articulo_dto_1.UpdateArticuloDto !== "undefined" && update_articulo_dto_1.UpdateArticuloDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "remove", null);
exports.ArticulosController = ArticulosController = __decorate([
    (0, common_1.Controller)('api/articulos'),
    __metadata("design:paramtypes", [typeof (_a = typeof articulos_service_1.ArticulosService !== "undefined" && articulos_service_1.ArticulosService) === "function" ? _a : Object])
], ArticulosController);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateArticuloDto = void 0;
const class_validator_1 = __webpack_require__(25);
class CreateArticuloDto {
    nombre;
    marcaId;
    codigo_barras;
    precio;
    stock;
    stock_minimo;
    esPesable;
    categoriaId;
}
exports.CreateArticuloDto = CreateArticuloDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateArticuloDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateArticuloDto.prototype, "marcaId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateArticuloDto.prototype, "codigo_barras", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateArticuloDto.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateArticuloDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateArticuloDto.prototype, "stock_minimo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateArticuloDto.prototype, "esPesable", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateArticuloDto.prototype, "categoriaId", void 0);


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateArticuloDto = void 0;
const class_validator_1 = __webpack_require__(25);
class UpdateArticuloDto {
    nombre;
    codigo_barras;
    precio;
    stock;
    stock_minimo;
    esPesable;
    categoriaId;
    marcaId;
}
exports.UpdateArticuloDto = UpdateArticuloDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateArticuloDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateArticuloDto.prototype, "codigo_barras", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateArticuloDto.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateArticuloDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateArticuloDto.prototype, "stock_minimo", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateArticuloDto.prototype, "esPesable", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateArticuloDto.prototype, "categoriaId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateArticuloDto.prototype, "marcaId", void 0);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriasModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const categorias_service_1 = __webpack_require__(28);
const categorias_controller_1 = __webpack_require__(29);
const categoria_entity_1 = __webpack_require__(9);
let CategoriasModule = class CategoriasModule {
};
exports.CategoriasModule = CategoriasModule;
exports.CategoriasModule = CategoriasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([categoria_entity_1.Categoria])],
        controllers: [categorias_controller_1.CategoriasController],
        providers: [categorias_service_1.CategoriasService],
    })
], CategoriasModule);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriasService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(10);
const categoria_entity_1 = __webpack_require__(9);
let CategoriasService = class CategoriasService {
    categoriaRepository;
    constructor(categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }
    findAll() {
        return this.categoriaRepository.find();
    }
    async findOne(id) {
        const categoria = await this.categoriaRepository.findOneBy({ id });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoría con ID #${id} no encontrada.`);
        }
        return categoria;
    }
    create(createCategoriaDto) {
        const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto);
        return this.categoriaRepository.save(nuevaCategoria);
    }
    async update(id, updateCategoriaDto) {
        const categoria = await this.categoriaRepository.preload({
            id,
            ...updateCategoriaDto,
        });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoría con ID #${id} no encontrada para actualizar.`);
        }
        return this.categoriaRepository.save(categoria);
    }
    async remove(id) {
        const categoria = await this.findOne(id);
        await this.categoriaRepository.remove(categoria);
        return { message: `Categoría con ID #${id} eliminada.` };
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], CategoriasService);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriasController = void 0;
const common_1 = __webpack_require__(3);
const categorias_service_1 = __webpack_require__(28);
const create_categoria_dto_1 = __webpack_require__(30);
const update_categoria_dto_1 = __webpack_require__(31);
let CategoriasController = class CategoriasController {
    categoriasService;
    constructor(categoriasService) {
        this.categoriasService = categoriasService;
    }
    create(createCategoriaDto) {
        return this.categoriasService.create(createCategoriaDto);
    }
    findAll() {
        return this.categoriasService.findAll();
    }
    findOne(id) {
        return this.categoriasService.findOne(id);
    }
    update(id, updateCategoriaDto) {
        return this.categoriasService.update(id, updateCategoriaDto);
    }
    remove(id) {
        return this.categoriasService.remove(id);
    }
};
exports.CategoriasController = CategoriasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_categoria_dto_1.CreateCategoriaDto !== "undefined" && create_categoria_dto_1.CreateCategoriaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof update_categoria_dto_1.UpdateCategoriaDto !== "undefined" && update_categoria_dto_1.UpdateCategoriaDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "remove", null);
exports.CategoriasController = CategoriasController = __decorate([
    (0, common_1.Controller)('api/categorias'),
    __metadata("design:paramtypes", [typeof (_a = typeof categorias_service_1.CategoriasService !== "undefined" && categorias_service_1.CategoriasService) === "function" ? _a : Object])
], CategoriasController);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoriaDto = void 0;
const class_validator_1 = __webpack_require__(25);
class CreateCategoriaDto {
    nombre;
}
exports.CreateCategoriaDto = CreateCategoriaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCategoriaDto.prototype, "nombre", void 0);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCategoriaDto = void 0;
const mapped_types_1 = __webpack_require__(32);
const create_categoria_dto_1 = __webpack_require__(30);
class UpdateCategoriaDto extends (0, mapped_types_1.PartialType)(create_categoria_dto_1.CreateCategoriaDto) {
}
exports.UpdateCategoriaDto = UpdateCategoriaDto;


/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProveedoresModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const proveedores_service_1 = __webpack_require__(34);
const proveedores_controller_1 = __webpack_require__(35);
const proveedores_entity_1 = __webpack_require__(14);
let ProveedoresModule = class ProveedoresModule {
};
exports.ProveedoresModule = ProveedoresModule;
exports.ProveedoresModule = ProveedoresModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([proveedores_entity_1.Proveedor])],
        controllers: [proveedores_controller_1.ProveedoresController],
        providers: [proveedores_service_1.ProveedoresService],
    })
], ProveedoresModule);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProveedoresService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(10);
const proveedores_entity_1 = __webpack_require__(14);
let ProveedoresService = class ProveedoresService {
    proveedorRepository;
    constructor(proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }
    create(createProveedorDto) {
        const nuevoProveedor = this.proveedorRepository.create(createProveedorDto);
        return this.proveedorRepository.save(nuevoProveedor);
    }
    findAll() {
        return this.proveedorRepository.find({ order: { nombre: 'ASC' } });
    }
    async findOne(id) {
        const proveedor = await this.proveedorRepository.findOneBy({ id });
        if (!proveedor) {
            throw new common_1.NotFoundException(`Proveedor con ID #${id} no encontrado.`);
        }
        return proveedor;
    }
    async update(id, updateProveedorDto) {
        const proveedor = await this.findOne(id);
        this.proveedorRepository.merge(proveedor, updateProveedorDto);
        return this.proveedorRepository.save(proveedor);
    }
    async remove(id) {
        const proveedor = await this.findOne(id);
        try {
            await this.proveedorRepository.remove(proveedor);
            return { message: `Proveedor "${proveedor.nombre}" (ID: ${id}) eliminado.` };
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_ROW_IS_REFERENCED_2' || mysqlError.errno === 1451) {
                throw new common_1.ConflictException(`No se puede eliminar el proveedor "${proveedor.nombre}" porque ya tiene pedidos u otros registros asociados.`);
            }
            throw error;
        }
    }
};
exports.ProveedoresService = ProveedoresService;
exports.ProveedoresService = ProveedoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proveedores_entity_1.Proveedor)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ProveedoresService);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProveedoresController = void 0;
const common_1 = __webpack_require__(3);
const proveedores_service_1 = __webpack_require__(34);
const create_proveedor_dto_1 = __webpack_require__(36);
let ProveedoresController = class ProveedoresController {
    proveedoresService;
    constructor(proveedoresService) {
        this.proveedoresService = proveedoresService;
    }
    create(createProveedorDto) {
        return this.proveedoresService.create(createProveedorDto);
    }
    findAll() {
        return this.proveedoresService.findAll();
    }
    findOne(id) {
        return this.proveedoresService.findOne(id);
    }
    update(id, updateProveedorDto) {
        return this.proveedoresService.update(id, updateProveedorDto);
    }
    remove(id) {
        return this.proveedoresService.remove(id);
    }
};
exports.ProveedoresController = ProveedoresController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_proveedor_dto_1.CreateProveedorDto !== "undefined" && create_proveedor_dto_1.CreateProveedorDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ skipMissingProperties: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof create_proveedor_dto_1.CreateProveedorDto !== "undefined" && create_proveedor_dto_1.CreateProveedorDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "remove", null);
exports.ProveedoresController = ProveedoresController = __decorate([
    (0, common_1.Controller)('api/proveedores'),
    __metadata("design:paramtypes", [typeof (_a = typeof proveedores_service_1.ProveedoresService !== "undefined" && proveedores_service_1.ProveedoresService) === "function" ? _a : Object])
], ProveedoresController);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateProveedorDto = void 0;
const class_validator_1 = __webpack_require__(25);
class CreateProveedorDto {
    nombre;
    contacto;
    telefono;
    email;
    direccion;
    cuit;
    notas;
}
exports.CreateProveedorDto = CreateProveedorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del proveedor es obligatorio' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateProveedorDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateProveedorDto.prototype, "contacto", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateProveedorDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El formato del email no es válido' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.email !== null && o.email !== ''),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateProveedorDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProveedorDto.prototype, "direccion", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateProveedorDto.prototype, "cuit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProveedorDto.prototype, "notas", void 0);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PedidosModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const pedidos_service_1 = __webpack_require__(38);
const pedidos_controller_1 = __webpack_require__(39);
const pedido_entity_1 = __webpack_require__(13);
const pedido_detalle_entity_1 = __webpack_require__(12);
const articulo_entity_1 = __webpack_require__(8);
let PedidosModule = class PedidosModule {
};
exports.PedidosModule = PedidosModule;
exports.PedidosModule = PedidosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pedido_entity_1.Pedido,
                pedido_detalle_entity_1.PedidoDetalle,
                articulo_entity_1.Articulo,
            ]),
        ],
        controllers: [pedidos_controller_1.PedidosController],
        providers: [pedidos_service_1.PedidosService],
    })
], PedidosModule);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PedidosService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PedidosService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(10);
const articulo_entity_1 = __webpack_require__(8);
const pedido_detalle_entity_1 = __webpack_require__(12);
const pedido_entity_1 = __webpack_require__(13);
let PedidosService = PedidosService_1 = class PedidosService {
    pedidoRepository;
    detalleRepository;
    articuloRepository;
    dataSource;
    logger = new common_1.Logger(PedidosService_1.name);
    constructor(pedidoRepository, detalleRepository, articuloRepository, dataSource) {
        this.pedidoRepository = pedidoRepository;
        this.detalleRepository = detalleRepository;
        this.articuloRepository = articuloRepository;
        this.dataSource = dataSource;
    }
    async create(createPedidoDto) {
        const { proveedorId, notas, items } = createPedidoDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalPedido = 0;
            const detallesPedido = [];
            for (const itemDto of items) {
                const articulo = await this.articuloRepository.findOneBy({
                    id: itemDto.articuloId,
                });
                if (!articulo) {
                    throw new common_1.NotFoundException(`Artículo con ID #${itemDto.articuloId} no encontrado.`);
                }
                const precioUnitario = Number(articulo.precio);
                const subtotal = precioUnitario * itemDto.cantidad;
                totalPedido += subtotal;
                const detalle = new pedido_detalle_entity_1.PedidoDetalle();
                detalle.articuloId = itemDto.articuloId;
                detalle.cantidad = itemDto.cantidad;
                detalle.precioUnitario = precioUnitario;
                detalle.subtotal = subtotal;
                detallesPedido.push(detalle);
            }
            const pedido = new pedido_entity_1.Pedido();
            pedido.proveedorId = proveedorId;
            pedido.notas = notas || null;
            pedido.fechaPedido = new Date();
            pedido.total = totalPedido;
            pedido.estado = createPedidoDto.estado || 'Pendiente';
            const pedidoGuardado = await queryRunner.manager.save(pedido);
            for (const detalle of detallesPedido) {
                detalle.pedidoId = pedidoGuardado.id;
                await queryRunner.manager.save(detalle);
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Pedido #${pedidoGuardado.id} creado exitosamente.`);
            return this.findOne(pedidoGuardado.id);
        }
        catch (err) {
            this.logger.error(`Error al crear el pedido: ${err.message}`, err.stack);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(proveedorId, desde, hasta) {
        const where = {};
        if (proveedorId) {
            where.proveedorId = proveedorId;
        }
        if (desde && hasta) {
            const fechaInicio = new Date(`${desde}T00:00:00`);
            const fechaFin = new Date(`${hasta}T23:59:59`);
            where.fechaPedido = (0, typeorm_2.Between)(fechaInicio, fechaFin);
        }
        else if (desde) {
            const fechaInicio = new Date(`${desde}T00:00:00`);
            where.fechaPedido = (0, typeorm_2.MoreThanOrEqual)(fechaInicio);
        }
        else if (hasta) {
            const fechaFin = new Date(`${hasta}T23:59:59`);
            where.fechaPedido = (0, typeorm_2.LessThanOrEqual)(fechaFin);
        }
        return this.pedidoRepository.find({
            where,
            relations: ['proveedor', 'items', 'items.articulo'],
            order: { fechaPedido: 'DESC' },
        });
    }
    async findOne(id) {
        const pedido = await this.pedidoRepository.findOne({
            where: { id },
            relations: ['proveedor', 'items', 'items.articulo'],
        });
        if (!pedido) {
            throw new common_1.NotFoundException(`Pedido con ID #${id} no encontrado.`);
        }
        return pedido;
    }
    async remove(id) {
        const pedido = await this.findOne(id);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(pedido_detalle_entity_1.PedidoDetalle, { pedidoId: id });
            await queryRunner.manager.delete(pedido_entity_1.Pedido, { id: id });
            await queryRunner.commitTransaction();
            this.logger.warn(`Pedido #${pedido.id} (Proveedor: ${pedido.proveedor.nombre}) eliminado permanentemente.`);
            return { message: `Pedido #${pedido.id} eliminado exitosamente` };
        }
        catch (err) {
            this.logger.error(`Error al eliminar el pedido: ${err.message}`, err.stack);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updatePedidoDto) {
        const pedido = await this.findOne(id);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (updatePedidoDto.proveedorId)
                pedido.proveedorId = updatePedidoDto.proveedorId;
            if (updatePedidoDto.notas !== undefined)
                pedido.notas = updatePedidoDto.notas;
            if (updatePedidoDto.estado)
                pedido.estado = updatePedidoDto.estado;
            if (updatePedidoDto.items && updatePedidoDto.items.length > 0) {
                await queryRunner.manager.delete(pedido_detalle_entity_1.PedidoDetalle, { pedidoId: id });
                let totalPedido = 0;
                for (const itemDto of updatePedidoDto.items) {
                    const articulo = await this.articuloRepository.findOneBy({ id: itemDto.articuloId });
                    if (!articulo)
                        continue;
                    const precioUnitario = Number(articulo.precio);
                    const subtotal = precioUnitario * itemDto.cantidad;
                    totalPedido += subtotal;
                    const detalle = new pedido_detalle_entity_1.PedidoDetalle();
                    detalle.pedidoId = pedido.id;
                    detalle.articuloId = itemDto.articuloId;
                    detalle.cantidad = itemDto.cantidad;
                    detalle.precioUnitario = precioUnitario;
                    detalle.subtotal = subtotal;
                    await queryRunner.manager.save(detalle);
                }
                pedido.total = totalPedido;
            }
            const pedidoActualizado = await queryRunner.manager.save(pedido);
            await queryRunner.commitTransaction();
            this.logger.log(`Pedido #${pedidoActualizado.id} actualizado exitosamente.`);
            return this.findOne(pedidoActualizado.id);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = PedidosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pedido_entity_1.Pedido)),
    __param(1, (0, typeorm_1.InjectRepository)(pedido_detalle_entity_1.PedidoDetalle)),
    __param(2, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _d : Object])
], PedidosService);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PedidosController = void 0;
const common_1 = __webpack_require__(3);
const pedidos_service_1 = __webpack_require__(38);
const create_pedido_dto_1 = __webpack_require__(40);
const update_pedido_dto_1 = __webpack_require__(42);
let PedidosController = class PedidosController {
    pedidosService;
    constructor(pedidosService) {
        this.pedidosService = pedidosService;
    }
    create(createPedidoDto) {
        return this.pedidosService.create(createPedidoDto);
    }
    findAll(proveedorId, desde, hasta) {
        const provId = proveedorId ? parseInt(proveedorId, 10) : undefined;
        return this.pedidosService.findAll(provId, desde, hasta);
    }
    findOne(id) {
        return this.pedidosService.findOne(id);
    }
    remove(id) {
        return this.pedidosService.remove(id);
    }
    update(id, updatePedidoDto) {
        return this.pedidosService.update(id, updatePedidoDto);
    }
};
exports.PedidosController = PedidosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_pedido_dto_1.CreatePedidoDto !== "undefined" && create_pedido_dto_1.CreatePedidoDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('proveedorId')),
    __param(1, (0, common_1.Query)('desde')),
    __param(2, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof update_pedido_dto_1.UpdatePedidoDto !== "undefined" && update_pedido_dto_1.UpdatePedidoDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "update", null);
exports.PedidosController = PedidosController = __decorate([
    (0, common_1.Controller)('api/pedidos'),
    __metadata("design:paramtypes", [typeof (_a = typeof pedidos_service_1.PedidosService !== "undefined" && pedidos_service_1.PedidosService) === "function" ? _a : Object])
], PedidosController);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePedidoDto = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(25);
class CreatePedidoItemDto {
    articuloId;
    cantidad;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreatePedidoItemDto.prototype, "articuloId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], CreatePedidoItemDto.prototype, "cantidad", void 0);
class CreatePedidoDto {
    proveedorId;
    notas;
    estado;
    items;
}
exports.CreatePedidoDto = CreatePedidoDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreatePedidoDto.prototype, "proveedorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePedidoDto.prototype, "notas", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePedidoDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreatePedidoItemDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreatePedidoDto.prototype, "items", void 0);


/***/ }),
/* 41 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePedidoDto = void 0;
const mapped_types_1 = __webpack_require__(32);
const create_pedido_dto_1 = __webpack_require__(40);
class UpdatePedidoDto extends (0, mapped_types_1.PartialType)(create_pedido_dto_1.CreatePedidoDto) {
}
exports.UpdatePedidoDto = UpdatePedidoDto;


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VentasModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const articulo_entity_1 = __webpack_require__(8);
const venta_entity_1 = __webpack_require__(16);
const venta_detalle_entity_1 = __webpack_require__(15);
const ventas_service_1 = __webpack_require__(44);
const ventas_controller_1 = __webpack_require__(45);
const cliente_entity_1 = __webpack_require__(17);
let VentasModule = class VentasModule {
};
exports.VentasModule = VentasModule;
exports.VentasModule = VentasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                venta_entity_1.Venta,
                venta_detalle_entity_1.VentaDetalle,
                articulo_entity_1.Articulo,
                cliente_entity_1.Cliente,
            ])
        ],
        controllers: [ventas_controller_1.VentasController],
        providers: [ventas_service_1.VentasService],
    })
], VentasModule);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VentasService_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VentasService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const articulo_entity_1 = __webpack_require__(8);
const cliente_entity_1 = __webpack_require__(17);
const turnos_util_1 = __webpack_require__(19);
const typeorm_2 = __webpack_require__(10);
const venta_detalle_entity_1 = __webpack_require__(15);
const venta_entity_1 = __webpack_require__(16);
let VentasService = VentasService_1 = class VentasService {
    ventaRepository;
    detalleRepository;
    articuloRepository;
    clienteRepository;
    dataSource;
    logger = new common_1.Logger(VentasService_1.name);
    constructor(ventaRepository, detalleRepository, articuloRepository, clienteRepository, dataSource) {
        this.ventaRepository = ventaRepository;
        this.detalleRepository = detalleRepository;
        this.articuloRepository = articuloRepository;
        this.clienteRepository = clienteRepository;
        this.dataSource = dataSource;
    }
    async create(createVentaDto) {
        const { clienteId, clienteNombre, items, formaPago, interes, estado } = createVentaDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let subtotalVenta = 0;
            let totalVenta = 0;
            const detallesVenta = [];
            const [maxResult] = await queryRunner.manager.query('SELECT MAX("numeroVenta") as maxNum FROM ventas');
            const siguienteNumeroVenta = (Number(maxResult?.maxNum) || 0) + 1;
            if (estado === venta_entity_1.VentaEstado.PENDIENTE && !clienteId && !clienteNombre) {
                throw new Error('El nombre del cliente o el ID del cliente es obligatorio para cuentas corrientes.');
            }
            for (const itemDto of items) {
                const articulo = await queryRunner.manager.findOne(articulo_entity_1.Articulo, {
                    where: { id: itemDto.articuloId },
                });
                if (!articulo) {
                    throw new common_1.NotFoundException(`Artículo con ID #${itemDto.articuloId} no encontrado.`);
                }
                if (articulo.stock < itemDto.cantidad) {
                    throw new Error(`Stock insuficiente para "${articulo.nombre}". Stock actual: ${articulo.stock}, se solicitan: ${itemDto.cantidad}.`);
                }
                articulo.stock -= itemDto.cantidad;
                await queryRunner.manager.save(articulo_entity_1.Articulo, articulo);
                const precioUnitario = Number(articulo.precio);
                const subtotalItem = itemDto.subtotalPersonalizado !== undefined
                    ? Number(itemDto.subtotalPersonalizado)
                    : precioUnitario * itemDto.cantidad;
                subtotalVenta += subtotalItem;
                const detalle = new venta_detalle_entity_1.VentaDetalle();
                detalle.articuloId = itemDto.articuloId;
                detalle.cantidad = itemDto.cantidad;
                detalle.precioUnitario = precioUnitario;
                detalle.subtotal = subtotalItem;
                detallesVenta.push(detalle);
            }
            const interesCalculado = interes || 0;
            totalVenta = subtotalVenta + interesCalculado;
            const ahora = new Date();
            const nuevaVenta = new venta_entity_1.Venta();
            nuevaVenta.numeroVenta = siguienteNumeroVenta;
            nuevaVenta.fechaHora = ahora;
            nuevaVenta.clienteId = clienteId || null;
            nuevaVenta.clienteNombre = clienteNombre || 'Cliente General';
            nuevaVenta.subtotal = subtotalVenta;
            nuevaVenta.interes = interesCalculado;
            nuevaVenta.total = totalVenta;
            nuevaVenta.monto_pagado = estado === venta_entity_1.VentaEstado.COMPLETADA ? totalVenta : 0;
            nuevaVenta.formaPago =
                estado === venta_entity_1.VentaEstado.COMPLETADA ? formaPago : null;
            nuevaVenta.estado = estado;
            nuevaVenta.turno = (0, turnos_util_1.determinarTurno)(ahora);
            const ventaGuardada = await queryRunner.manager.save(venta_entity_1.Venta, nuevaVenta);
            for (const detalle of detallesVenta) {
                detalle.venta = ventaGuardada;
                await queryRunner.manager.save(venta_detalle_entity_1.VentaDetalle, detalle);
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Venta #${ventaGuardada.numeroVenta} creada exitosamente.`);
            return this.findOne(ventaGuardada.id);
        }
        catch (err) {
            this.logger.error(`Error al crear la venta: ${err.message}`);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(fecha) {
        const where = {};
        if (fecha) {
            const fechaInicio = new Date(`${fecha}T00:00:00`);
            const fechaFin = new Date(`${fecha}T23:59:59`);
            where.fechaHora = (0, typeorm_2.Between)(fechaInicio, fechaFin);
        }
        return this.ventaRepository.find({
            where,
            relations: ['cliente', 'items', 'items.articulo'],
            order: { fechaHora: 'DESC' },
        });
    }
    async findPendientes() {
        return this.ventaRepository.find({
            where: {
                clienteNombre: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
            },
            relations: ['items', 'items.articulo', 'cliente'],
            order: { fechaHora: 'ASC' },
        });
    }
    async findOne(id) {
        const venta = await this.ventaRepository.findOne({
            where: { id },
            relations: ['items', 'items.articulo', 'cliente'],
        });
        if (!venta) {
            throw new common_1.NotFoundException(`Venta con ID #${id} no encontrada.`);
        }
        return venta;
    }
    async pagarCuentaCorriente(dto) {
        const { clienteNombre, monto, formaPago, fecha } = dto;
        let dineroDisponible = Number(monto);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let fechaPago = new Date();
            if (fecha) {
                const [year, month, day] = fecha.split('-').map(Number);
                const hoy = new Date();
                const esMismoDia = hoy.getFullYear() === year &&
                    (hoy.getMonth() + 1) === month &&
                    hoy.getDate() === day;
                if (!esMismoDia) {
                    fechaPago = new Date(year, month - 1, day, 12, 0, 0);
                }
            }
            const [maxResult] = await queryRunner.manager.query('SELECT MAX("numeroVenta") as maxNum FROM ventas');
            const siguienteNumeroVenta = (Number(maxResult?.maxNum) || 0) + 1;
            const reciboVenta = new venta_entity_1.Venta();
            reciboVenta.numeroVenta = siguienteNumeroVenta;
            reciboVenta.fechaHora = fechaPago;
            reciboVenta.clienteNombre = clienteNombre;
            reciboVenta.clienteId = null;
            reciboVenta.subtotal = dineroDisponible;
            reciboVenta.interes = 0;
            reciboVenta.total = dineroDisponible;
            reciboVenta.monto_pagado = dineroDisponible;
            reciboVenta.formaPago = formaPago;
            reciboVenta.estado = venta_entity_1.VentaEstado.COMPLETADA;
            reciboVenta.turno = (0, turnos_util_1.determinarTurno)(fechaPago);
            await queryRunner.manager.save(venta_entity_1.Venta, reciboVenta);
            const detalleRecibo = new venta_detalle_entity_1.VentaDetalle();
            detalleRecibo.venta = reciboVenta;
            detalleRecibo.cantidad = 1;
            detalleRecibo.precioUnitario = dineroDisponible;
            detalleRecibo.subtotal = dineroDisponible;
            if (reciboVenta.id) {
            }
            const ventasPendientes = await queryRunner.manager.find(venta_entity_1.Venta, {
                where: {
                    clienteNombre: clienteNombre,
                    estado: venta_entity_1.VentaEstado.PENDIENTE,
                },
                order: {
                    fechaHora: 'ASC',
                },
            });
            let saldoParaCancelar = Number(monto);
            const ventasActualizadas = [];
            for (const venta of ventasPendientes) {
                if (saldoParaCancelar <= 0.01)
                    break;
                const totalVenta = Number(venta.total);
                const pagadoPrevio = Number(venta.monto_pagado);
                const deudaRestante = totalVenta - pagadoPrevio;
                if (saldoParaCancelar >= deudaRestante) {
                    venta.monto_pagado = totalVenta;
                    venta.estado = venta_entity_1.VentaEstado.COMPLETADA;
                    saldoParaCancelar -= deudaRestante;
                }
                else {
                    venta.monto_pagado = pagadoPrevio + saldoParaCancelar;
                    venta.estado = venta_entity_1.VentaEstado.PENDIENTE;
                    saldoParaCancelar = 0;
                }
                ventasActualizadas.push(venta);
            }
            await queryRunner.manager.save(venta_entity_1.Venta, ventasActualizadas);
            await queryRunner.commitTransaction();
            this.logger.log(`Pago registrado para ${clienteNombre}. Recibo #${siguienteNumeroVenta}`);
            return {
                message: 'Pago registrado correctamente',
                ventasAfectadas: ventasActualizadas.length,
                reciboGenerado: siguienteNumeroVenta
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error al registrar pago cuenta corriente: ${err.message}`);
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async registrarPago(id, registrarPagoDto) {
        const { formaPago, interes } = registrarPagoDto;
        const venta = await this.ventaRepository.findOneBy({ id });
        if (!venta) {
            throw new common_1.NotFoundException(`Venta con ID #${id} no encontrada.`);
        }
        if (venta.estado !== venta_entity_1.VentaEstado.PENDIENTE) {
            throw new Error('Esta venta no está pendiente de pago.');
        }
        const ahora = new Date();
        const interesCalculado = interes || 0;
        const totalActualizado = Number(venta.subtotal) + interesCalculado;
        venta.estado = venta_entity_1.VentaEstado.COMPLETADA;
        venta.formaPago = formaPago;
        venta.interes = interesCalculado;
        venta.total = totalActualizado;
        venta.monto_pagado = totalActualizado;
        venta.fechaHora = ahora;
        venta.turno = (0, turnos_util_1.determinarTurno)(ahora);
        this.logger.log(`Pago total registrado para Venta #${venta.numeroVenta}.`);
        return this.ventaRepository.save(venta);
    }
    async delete(id) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const venta = await queryRunner.manager.findOne(venta_entity_1.Venta, {
                where: { id },
                relations: ['items'],
            });
            if (!venta) {
                throw new common_1.NotFoundException(`Venta con ID #${id} no encontrada.`);
            }
            if (venta.estado === venta_entity_1.VentaEstado.COMPLETADA ||
                venta.estado === venta_entity_1.VentaEstado.PENDIENTE) {
                for (const item of venta.items) {
                    await queryRunner.manager.increment(articulo_entity_1.Articulo, { id: item.articuloId }, 'stock', item.cantidad);
                    this.logger.log(`Stock devuelto: ${item.cantidad} a Artículo ID #${item.articuloId}`);
                }
            }
            await queryRunner.manager.delete(venta_entity_1.Venta, { id });
            await queryRunner.commitTransaction();
            this.logger.warn(`Venta #${venta.numeroVenta} eliminada permanentemente.`);
            return {
                message: `Venta #${venta.numeroVenta} eliminada exitosamente`,
                ventaEliminada: venta.numeroVenta,
            };
        }
        catch (err) {
            this.logger.error(`Error al eliminar la venta: ${err.message}`);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteAll() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const ventas = await queryRunner.manager.find(venta_entity_1.Venta, {
                relations: ['items'],
            });
            for (const venta of ventas) {
                if (venta.estado === venta_entity_1.VentaEstado.COMPLETADA ||
                    venta.estado === venta_entity_1.VentaEstado.PENDIENTE) {
                    for (const item of venta.items) {
                        await queryRunner.manager.increment(articulo_entity_1.Articulo, { id: item.articuloId }, 'stock', item.cantidad);
                    }
                }
            }
            await queryRunner.manager.delete(venta_detalle_entity_1.VentaDetalle, {});
            const result = await queryRunner.manager.delete(venta_entity_1.Venta, {});
            await queryRunner.manager.query(`DELETE FROM sqlite_sequence WHERE name = 'ventas'`);
            await queryRunner.manager.query(`DELETE FROM sqlite_sequence WHERE name = 'venta_detalles'`);
            await queryRunner.commitTransaction();
            const cantidadEliminada = result.affected || 0;
            this.logger.warn(`Se eliminaron ${cantidadEliminada} ventas de prueba.`);
            return {
                message: 'Todas las ventas fueron eliminadas exitosamente',
                ventasEliminadas: cantidadEliminada,
            };
        }
        catch (err) {
            this.logger.error(`Error al eliminar ventas: ${err.message}`);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.VentasService = VentasService;
exports.VentasService = VentasService = VentasService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(1, (0, typeorm_1.InjectRepository)(venta_detalle_entity_1.VentaDetalle)),
    __param(2, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __param(3, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _e : Object])
], VentasService);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VentasController = void 0;
const common_1 = __webpack_require__(3);
const ventas_service_1 = __webpack_require__(44);
const venta_dto_1 = __webpack_require__(46);
const pagar_cuenta_dto_1 = __webpack_require__(47);
let VentasController = class VentasController {
    ventasService;
    constructor(ventasService) {
        this.ventasService = ventasService;
    }
    create(createVentaDto) {
        return this.ventasService.create(createVentaDto);
    }
    findAll(fecha) {
        return this.ventasService.findAll(fecha);
    }
    findPendientes() {
        return this.ventasService.findPendientes();
    }
    findOne(id) {
        return this.ventasService.findOne(id);
    }
    registrarPago(id, registrarPagoDto) {
        return this.ventasService.registrarPago(id, registrarPagoDto);
    }
    registrarPagoCuenta(pagarCuentaDto) {
        return this.ventasService.pagarCuentaCorriente(pagarCuentaDto);
    }
    async deleteAll() {
        return this.ventasService.deleteAll();
    }
    async delete(id) {
        return this.ventasService.delete(id);
    }
};
exports.VentasController = VentasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof venta_dto_1.CreateVentaDto !== "undefined" && venta_dto_1.CreateVentaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pendientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findPendientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/pagar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof venta_dto_1.RegistrarPagoDto !== "undefined" && venta_dto_1.RegistrarPagoDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "registrarPago", null);
__decorate([
    (0, common_1.Post)('pagar-cuenta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof pagar_cuenta_dto_1.PagarCuentaDto !== "undefined" && pagar_cuenta_dto_1.PagarCuentaDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "registrarPagoCuenta", null);
__decorate([
    (0, common_1.Delete)('limpiar-datos-prueba'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "deleteAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "delete", null);
exports.VentasController = VentasController = __decorate([
    (0, common_1.Controller)('api/ventas'),
    __metadata("design:paramtypes", [typeof (_a = typeof ventas_service_1.VentasService !== "undefined" && ventas_service_1.VentasService) === "function" ? _a : Object])
], VentasController);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegistrarPagoDto = exports.CreateVentaDto = exports.CreateVentaItemDto = void 0;
const class_validator_1 = __webpack_require__(25);
const class_transformer_1 = __webpack_require__(41);
const venta_entity_1 = __webpack_require__(16);
class CreateVentaItemDto {
    articuloId;
    cantidad;
    subtotalPersonalizado;
}
exports.CreateVentaItemDto = CreateVentaItemDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVentaItemDto.prototype, "articuloId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], CreateVentaItemDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVentaItemDto.prototype, "subtotalPersonalizado", void 0);
class CreateVentaDto {
    clienteId;
    clienteNombre;
    items;
    formaPago;
    interes;
    estado;
}
exports.CreateVentaDto = CreateVentaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVentaDto.prototype, "clienteId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVentaDto.prototype, "clienteNombre", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_transformer_1.Type)(() => CreateVentaItemDto),
    __metadata("design:type", Array)
], CreateVentaDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(venta_entity_1.FormaPago),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof venta_entity_1.FormaPago !== "undefined" && venta_entity_1.FormaPago) === "function" ? _a : Object)
], CreateVentaDto.prototype, "formaPago", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVentaDto.prototype, "interes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(venta_entity_1.VentaEstado),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_b = typeof venta_entity_1.VentaEstado !== "undefined" && venta_entity_1.VentaEstado) === "function" ? _b : Object)
], CreateVentaDto.prototype, "estado", void 0);
class RegistrarPagoDto {
    formaPago;
    interes;
}
exports.RegistrarPagoDto = RegistrarPagoDto;
__decorate([
    (0, class_validator_1.IsEnum)(venta_entity_1.FormaPago),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_c = typeof venta_entity_1.FormaPago !== "undefined" && venta_entity_1.FormaPago) === "function" ? _c : Object)
], RegistrarPagoDto.prototype, "formaPago", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RegistrarPagoDto.prototype, "interes", void 0);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PagarCuentaDto = void 0;
const class_validator_1 = __webpack_require__(25);
class PagarCuentaDto {
    clienteNombre;
    monto;
    formaPago;
    interes;
    fecha;
}
exports.PagarCuentaDto = PagarCuentaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PagarCuentaDto.prototype, "clienteNombre", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PagarCuentaDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PagarCuentaDto.prototype, "formaPago", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PagarCuentaDto.prototype, "interes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagarCuentaDto.prototype, "fecha", void 0);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientesModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const clientes_service_1 = __webpack_require__(49);
const cliente_entity_1 = __webpack_require__(17);
const clientes_controller_1 = __webpack_require__(50);
let ClientesModule = class ClientesModule {
};
exports.ClientesModule = ClientesModule;
exports.ClientesModule = ClientesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cliente_entity_1.Cliente])],
        controllers: [clientes_controller_1.ClientesController],
        providers: [clientes_service_1.ClientesService],
        exports: [typeorm_1.TypeOrmModule],
    })
], ClientesModule);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientesService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(10);
const cliente_entity_1 = __webpack_require__(17);
let ClientesService = class ClientesService {
    clienteRepository;
    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    create(createClienteDto) {
        const nuevoCliente = this.clienteRepository.create(createClienteDto);
        return this.clienteRepository.save(nuevoCliente);
    }
    findAll() {
        return this.clienteRepository.find({
            order: { nombre: 'ASC' },
        });
    }
    async findOne(id) {
        const cliente = await this.clienteRepository.findOneBy({ id });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con ID #${id} no encontrado.`);
        }
        return cliente;
    }
    async update(id, updateClienteDto) {
        const cliente = await this.clienteRepository.preload({
            id,
            ...updateClienteDto,
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con ID #${id} no encontrado.`);
        }
        return this.clienteRepository.save(cliente);
    }
    async remove(id) {
        const cliente = await this.findOne(id);
        await this.clienteRepository.remove(cliente);
        return { message: `Cliente "${cliente.nombre}" (ID #${id}) eliminado.` };
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ClientesService);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientesController = void 0;
const common_1 = __webpack_require__(3);
const clientes_service_1 = __webpack_require__(49);
const create_cliente_dto_1 = __webpack_require__(51);
const update_cliente_dto_1 = __webpack_require__(52);
let ClientesController = class ClientesController {
    clientesService;
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    create(createClienteDto) {
        return this.clientesService.create(createClienteDto);
    }
    findAll() {
        return this.clientesService.findAll();
    }
    findOne(id) {
        return this.clientesService.findOne(id);
    }
    update(id, updateClienteDto) {
        return this.clientesService.update(id, updateClienteDto);
    }
    remove(id) {
        return this.clientesService.remove(id);
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_cliente_dto_1.CreateClienteDto !== "undefined" && create_cliente_dto_1.CreateClienteDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof update_cliente_dto_1.UpdateClienteDto !== "undefined" && update_cliente_dto_1.UpdateClienteDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "remove", null);
exports.ClientesController = ClientesController = __decorate([
    (0, common_1.Controller)('api/clientes'),
    __metadata("design:paramtypes", [typeof (_a = typeof clientes_service_1.ClientesService !== "undefined" && clientes_service_1.ClientesService) === "function" ? _a : Object])
], ClientesController);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateClienteDto = void 0;
const class_validator_1 = __webpack_require__(25);
class CreateClienteDto {
    nombre;
    telefono;
    email;
    direccion;
    limiteCredito;
}
exports.CreateClienteDto = CreateClienteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "direccion", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateClienteDto.prototype, "limiteCredito", void 0);


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateClienteDto = void 0;
const mapped_types_1 = __webpack_require__(32);
const create_cliente_dto_1 = __webpack_require__(51);
class UpdateClienteDto extends (0, mapped_types_1.PartialType)(create_cliente_dto_1.CreateClienteDto) {
}
exports.UpdateClienteDto = UpdateClienteDto;


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetirosModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const retiros_service_1 = __webpack_require__(54);
const retiros_controller_1 = __webpack_require__(55);
const retiro_entity_1 = __webpack_require__(18);
let RetirosModule = class RetirosModule {
};
exports.RetirosModule = RetirosModule;
exports.RetirosModule = RetirosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([retiro_entity_1.Retiro])],
        controllers: [retiros_controller_1.RetirosController],
        providers: [retiros_service_1.RetirosService],
    })
], RetirosModule);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RetirosService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetirosService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(10);
const retiro_entity_1 = __webpack_require__(18);
const turnos_util_1 = __webpack_require__(19);
let RetirosService = RetirosService_1 = class RetirosService {
    retiroRepository;
    logger = new common_1.Logger(RetirosService_1.name);
    constructor(retiroRepository) {
        this.retiroRepository = retiroRepository;
    }
    async create(createRetiroDto) {
        const ahora = new Date();
        const nuevoRetiro = this.retiroRepository.create({
            ...createRetiroDto,
            fechaHora: ahora,
            turno: (0, turnos_util_1.determinarTurno)(ahora),
        });
        const retiroGuardado = await this.retiroRepository.save(nuevoRetiro);
        this.logger.log(`Retiro de $${retiroGuardado.monto} registrado exitosamente.`);
        return retiroGuardado;
    }
    async findAll(fecha) {
        const where = {};
        if (fecha) {
            const fechaInicio = new Date(`${fecha}T00:00:00`);
            const fechaFin = new Date(`${fecha}T23:59:59`);
            where.fechaHora = (0, typeorm_2.Between)(fechaInicio, fechaFin);
        }
        return this.retiroRepository.find({
            where,
            order: { fechaHora: 'DESC' },
        });
    }
};
exports.RetirosService = RetirosService;
exports.RetirosService = RetirosService = RetirosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(retiro_entity_1.Retiro)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], RetirosService);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetirosController = void 0;
const common_1 = __webpack_require__(3);
const retiros_service_1 = __webpack_require__(54);
const create_retiro_dto_1 = __webpack_require__(56);
let RetirosController = class RetirosController {
    retirosService;
    constructor(retirosService) {
        this.retirosService = retirosService;
    }
    create(createRetiroDto) {
        return this.retirosService.create(createRetiroDto);
    }
    findAll(fecha) {
        return this.retirosService.findAll(fecha);
    }
};
exports.RetirosController = RetirosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_retiro_dto_1.CreateRetiroDto !== "undefined" && create_retiro_dto_1.CreateRetiroDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], RetirosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RetirosController.prototype, "findAll", null);
exports.RetirosController = RetirosController = __decorate([
    (0, common_1.Controller)('api/retiros'),
    __metadata("design:paramtypes", [typeof (_a = typeof retiros_service_1.RetirosService !== "undefined" && retiros_service_1.RetirosService) === "function" ? _a : Object])
], RetirosController);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRetiroDto = void 0;
const class_validator_1 = __webpack_require__(25);
class CreateRetiroDto {
    monto;
    motivo;
    formaPago;
}
exports.CreateRetiroDto = CreateRetiroDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'El monto debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateRetiroDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El motivo es obligatorio' }),
    __metadata("design:type", String)
], CreateRetiroDto.prototype, "motivo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La forma de pago es obligatoria' }),
    __metadata("design:type", String)
], CreateRetiroDto.prototype, "formaPago", void 0);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarcasModule = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const marcas_service_1 = __webpack_require__(58);
const marcas_controller_1 = __webpack_require__(59);
const marca_entity_1 = __webpack_require__(11);
let MarcasModule = class MarcasModule {
};
exports.MarcasModule = MarcasModule;
exports.MarcasModule = MarcasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([marca_entity_1.Marca])],
        controllers: [marcas_controller_1.MarcasController],
        providers: [marcas_service_1.MarcasService],
    })
], MarcasModule);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarcasService = void 0;
const common_1 = __webpack_require__(3);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(10);
const marca_entity_1 = __webpack_require__(11);
let MarcasService = class MarcasService {
    marcaRepository;
    constructor(marcaRepository) {
        this.marcaRepository = marcaRepository;
    }
    create(createMarcaDto) {
        const nuevaMarca = this.marcaRepository.create(createMarcaDto);
        return this.marcaRepository.save(nuevaMarca);
    }
    findAll() {
        return this.marcaRepository.find({ order: { nombre: 'ASC' } });
    }
    async findOne(id) {
        const marca = await this.marcaRepository.findOneBy({ id });
        if (!marca) {
            throw new common_1.NotFoundException(`Marca con ID #${id} no encontrada.`);
        }
        return marca;
    }
};
exports.MarcasService = MarcasService;
exports.MarcasService = MarcasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(marca_entity_1.Marca)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], MarcasService);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarcasController = void 0;
const common_1 = __webpack_require__(3);
const marcas_service_1 = __webpack_require__(58);
const create_marca_dto_1 = __webpack_require__(60);
let MarcasController = class MarcasController {
    marcasService;
    constructor(marcasService) {
        this.marcasService = marcasService;
    }
    create(createMarcaDto) {
        return this.marcasService.create(createMarcaDto);
    }
    findAll() {
        return this.marcasService.findAll();
    }
    findOne(id) {
        return this.marcasService.findOne(id);
    }
};
exports.MarcasController = MarcasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_marca_dto_1.CreateMarcaDto !== "undefined" && create_marca_dto_1.CreateMarcaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], MarcasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarcasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MarcasController.prototype, "findOne", null);
exports.MarcasController = MarcasController = __decorate([
    (0, common_1.Controller)('api/marcas'),
    __metadata("design:paramtypes", [typeof (_a = typeof marcas_service_1.MarcasService !== "undefined" && marcas_service_1.MarcasService) === "function" ? _a : Object])
], MarcasController);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMarcaDto = void 0;
const class_validator_1 = __webpack_require__(25);
class CreateMarcaDto {
    nombre;
}
exports.CreateMarcaDto = CreateMarcaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la marca no puede estar vacío.' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateMarcaDto.prototype, "nombre", void 0);


/***/ }),
/* 61 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const child_process_1 = __webpack_require__(61);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(3000, () => {
        console.log('Servidor iniciado en http://localhost:3000');
        const url = 'http://localhost:3000';
        if (!process.env.ELECTRON_RUN && process.platform === 'win32') {
            (0, child_process_1.exec)(`start ${url}`);
        }
    });
}
bootstrap();

})();

/******/ })()
;