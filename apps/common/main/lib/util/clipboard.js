// 添加剪贴板API覆盖 - 通过父页面代理执行剪贴板操作
const setupClipboardOverride = () => {
	if (!navigator.clipboard) return;
	if (window.parent === window) return;

	// 创建一个Promise的管理器，用于处理异步通信
	let messageId = 0;
    /**
     * @type {Map<number, { resolve: (value) => void; reject: (error) => void }>}
     */
	const pendingMessages = new Map();

	// 监听来自父页面的响应消息
    /**
     * @param {MessageEvent} event
     */
	const handleMessage = (event) => {
		if (event.data?.type === 'clipboardResponse') {
			const { id, success, data, error } = event.data;
			const pending = pendingMessages.get(id);
			if (pending) {
				pendingMessages.delete(id);
				if (success) {
					pending.resolve(data);
				} else {
					pending.reject(new Error(error));
				}
			}
		}
	};

	window.addEventListener('message', handleMessage);

    /**
     * 发送消息给父页面的辅助函数
     * 
     * @param {string} action
     * @param {any} data
     * @returns {Promise<any>}
     */
	const sendToParent = (action, data) => {
		return new Promise((resolve, reject) => {
			const id = ++messageId;
			pendingMessages.set(id, { resolve, reject });

			// 设置超时
			setTimeout(() => {
				if (pendingMessages.has(id)) {
					pendingMessages.delete(id);
					reject(new Error(`Clipboard ${action} timeout`));
				}
			}, 5000);

			// 发送消息到父页面
			if (window.parent !== window) {
				window.parent.postMessage({
					type: 'clipboardRequest',
					id,
					action,
					data
				}, '*');
			} else {
				// 如果不在iframe中，直接reject
				pendingMessages.delete(id);
				reject(new Error('Not in iframe'));
			}
		});
	};

	// 重写 navigator.clipboard 的方法
    /**
     * @returns {Promise<string>}
     */
	navigator.clipboard.readText = async function () {
		try {
			console.log('clipboard.readText - 通过父页面代理');
			const data = await sendToParent('readText');
			console.log('clipboard.readText - 通过父页面代理完成', data);
			return data;
		} catch (error) {
			console.log('剪贴板读取失败:', error);
			return '';
		}
	};

    /**
     * @param {string} text
     * @returns {Promise<void>}
     */
	navigator.clipboard.writeText = async function (text) {
		try {
			console.log('clipboard.writeText - 通过父页面代理', text);
			await sendToParent('writeText', text);
			console.log('clipboard.writeText - 通过父页面代理完成');
		} catch (error) {
			console.log('剪贴板写入失败:', error);
			throw error;
		}
	};

    /**
     * @returns {Promise<ClipboardItems>}
     */
	navigator.clipboard.read = async function () {
		try {
			console.log('clipboard.read - 通过父页面代理');
			const data = await sendToParent('read');
			console.log('clipboard.read - 通过父页面代理完成', data);

			// 如果没有数据，返回空数组
			if (!data || !Array.isArray(data)) {
				return [];
			}

			// 从序列化数据重新构造ClipboardItems
			const clipboardItems = data.map((itemData) => {
                /**
                 * @type {{ [key: string]: Blob }}
                 */
				const types = {};
				if (itemData.types) {
					for (const [type, typeData] of Object.entries(itemData.types)) {
						try {
							const { content, isText } = typeData;

							if (isText) {
								// 文本类型直接创建Blob
								types[type] = new Blob([content], { type });
							} else {
								// 二进制类型从base64解码
								const binaryString = atob(content);
								const bytes = new Uint8Array(binaryString.length);
								for (let i = 0; i < binaryString.length; i++) {
									bytes[i] = binaryString.charCodeAt(i);
								}
								types[type] = new Blob([bytes], { type });
							}
							console.log(`重构类型 ${type} (${isText ? '文本' : '二进制'})`);
						} catch (error) {
							console.warn(`无法重构类型 ${type}:`, error);
						}
					}
				}
				return new ClipboardItem(types);
			});

			console.log('clipboard.read - 重构的ClipboardItems:', clipboardItems);
			return clipboardItems;
		} catch (error) {
			console.log('剪贴板读取失败:', error);
			return [];
		}
	};

    /**
     * @param {ClipboardItems} items
     * @returns {Promise<void>}
     */
	navigator.clipboard.write = async function (items) {
		try {
			console.log('clipboard.write - 通过父页面代理', items);
			// 序列化ClipboardItems以便传输
			const serializedItems = await Promise.all(
				Array.from(items).map(async (item) => {
                    /**
                     * @type {{ [key: string]: { content: string; isText: boolean } }}
                     */
					const types = {};
					for (const type of item.types) {
						try {
							const blob = await item.getType(type);

							// 判断是否为文本类型
							const isTextType = type.startsWith('text/');

							if (isTextType) {
								// 文本类型直接转换为文本
								const text = await blob.text();
								types[type] = { content: text, isText: true };
							} else {
								// 二进制类型转换为base64
								const arrayBuffer = await blob.arrayBuffer();
								const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
								types[type] = { content: base64, isText: false };
							}
						} catch (error) {
							console.warn(`无法序列化类型 ${type}:`, error);
						}
					}
					return { types };
				})
			);

			await sendToParent('write', serializedItems);
			console.log('clipboard.write - 通过父页面代理完成');
		} catch (error) {
			console.log('剪贴板写入失败:', error);
			throw error;
		}
	};

	console.log('剪贴板代理已设置完成');
};

setupClipboardOverride();