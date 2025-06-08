import { showLoadingModal, hideLoadingModal } from './exportar-flutter.util';
/**
 * 
 * archvio para generar el panel de chat para el graficador 
 * 
 */

export function addFlutterMenuPanel(editor: any, geminiService: any) {
  // Añadir el botón al panel izquierdo (views)
  editor.Panels.addButton('views', {
    id: 'open-flutter-menu',
    className: 'fa fa-cubes', // Icono FontAwesome
    attributes: { title: 'Flutter Assistant' },
    command: 'open-flutter-menu',
    togglable: true,
  });

  // Añadir el comando para mostrar/ocultar el panel lateral derecho
  editor.Commands.add('open-flutter-menu', {
    run: (editor: any) => {
      let panel = document.getElementById('flutter-menu-panel');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'flutter-menu-panel';
        panel.className = 'panel__flutter-menu';
        panel.style.position = 'fixed';
        panel.style.top = '0';
        panel.style.right = '0';
        panel.style.width = '330px';
        panel.style.height = '100vh';
        panel.style.zIndex = '9999';
        panel.style.marginTop = '40px';
        panel.style.background = 'rgb(68,68,68)';
        panel.style.padding = '24px 18px 18px 18px';
        panel.style.borderLeft = '1.5px solid #e0e0e0';
        panel.style.boxShadow = '-2px 0 12px rgba(0,0,0,0.08)';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
            <span style="font-size:1.4rem;font-weight:600;color:#1976d2;">Flutter Assistant</span>
            <button id="close-flutter-menu-panel" style="margin-left:auto;background:none;border:none;font-size:1.5rem;color:#757575;cursor:pointer;">&times;</button>
          </div>
          <textarea id="flutter-assistant-textarea" placeholder="Escribe tu prompt..." style="color:white; width:100%;min-height:90px;max-height:200px;border-radius:10px;border:1.5px solid #bdbdbd;padding:12px;font-size:1rem;resize:vertical;margin-bottom:18px;"></textarea>
          <div style="display:flex;gap:16px;align-items:center;margin-bottom:18px;">
            <button id="flutter-assistant-audio" title="Enviar audio" style="background:#1976d2;border:none;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;cursor:pointer;"><i class="fa fa-microphone"></i></button>
            <button id="flutter-assistant-image" title="Enviar imagen" style="background:#43a047;border:none;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;cursor:pointer;"><i class="fa fa-image"></i></button>
          </div>
          <button id="flutter-assistant-send" style="background:#1976d2;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:1rem;cursor:pointer;width:100%;font-weight:600;">Enviar</button>
        `;
        document.body.appendChild(panel);
        // Cerrar panel al hacer click en la X
        document.getElementById('close-flutter-menu-panel')?.addEventListener('click', () => {
          panel!.style.display = 'none';
          // Desactivar el botón
          const btn = document.querySelector('[data-id="open-flutter-menu"]');
          if (btn) (btn as HTMLElement).classList.remove('gjs-pn-active');
        });

        // Botón Enviar: añade una tarjeta con imagen y texto al lienzo
        const sendBtn = document.getElementById('flutter-assistant-send');
        if (sendBtn) {
          sendBtn.addEventListener('click', async () => {
            const textarea = document.getElementById('flutter-assistant-textarea') as HTMLTextAreaElement;
            if (textarea && textarea.value.trim()) {
              try {
                showLoadingModal('Generando HTML...');
                let html = await geminiService.generacionHtmlFlutter(textarea.value.trim());
                if (html) {
                  html = html.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
                } else {
                  html = '';
                }
                editor.addComponents(html);
                textarea.value = '';
              } catch (e) {
                alert('Error generando HTML con GeminiService');
              } finally {
                hideLoadingModal();
              }
            }
          });
        }
        // Botón Enviar audio (grabación en directo)
        const audioBtn = document.getElementById('flutter-assistant-audio');
        if (audioBtn) {
          let mediaRecorder: MediaRecorder | null = null;
          let audioChunks: BlobPart[] = [];
          let isRecording = false;

          audioBtn.addEventListener('click', async () => {
            const btn = audioBtn as HTMLButtonElement;
            if (!isRecording) {
              // Iniciar grabación
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                mediaRecorder.ondataavailable = (e) => {
                  if (e.data.size > 0) audioChunks.push(e.data);
                };
                mediaRecorder.onstop = async () => {
                  const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                  const audioFile = new File([audioBlob], 'grabacion.webm', { type: 'audio/webm' });
                  btn.disabled = true;
                  btn.innerHTML = `<i class=\"fa fa-spinner fa-spin\"></i>`;
                  try {
                    showLoadingModal('Procesando audio...');
                    let html = await geminiService.audioAHtmlFlutter(audioFile);
                    if (html) {
                      html = html.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
                    } else {
                      html = '';
                    }
                    editor.addComponents(html);
                  } catch (e) {
                    alert('Error procesando el audio con GeminiService');
                  } finally {
                    btn.disabled = false;
                    btn.innerHTML = '<i class=\"fa fa-microphone\"></i>';
                    btn.style.background = '#1976d2';
                    btn.title = 'Enviar audio';
                    hideLoadingModal();
                  }
                };
                mediaRecorder.start();
                isRecording = true;
                btn.style.background = '#d32f2f';
                btn.title = 'Detener grabación';
              } catch (err) {
                alert('No se pudo acceder al micrófono.');
              }
            } else {
              if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
              }
              isRecording = false;
            }
          });
        }
        // Botón Enviar imagen
        const imageBtn = document.getElementById('flutter-assistant-image');
        if (imageBtn) {
          imageBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            input.addEventListener('change', async (event: any) => {
              const file = event.target.files[0];
              if (file) {
                try {
                  showLoadingModal('Procesando imagen...');
                  let html = await geminiService.textToImage(file);
                  if (html) {
                    html = html.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
                  } else {
                    html = '';
                  }
                  editor.addComponents(html);
                } catch (e) {
                  alert(`Error generando HTML desde imagen con GeminiService ${e}`);
                } finally {
                  hideLoadingModal();
                }
              }
            });
            document.body.appendChild(input);
            input.click();
            setTimeout(() => document.body.removeChild(input), 1000);
          });
        }
      }
      panel.style.display = 'flex';
    },
    stop: (editor: any) => {
      const panel = document.getElementById('flutter-menu-panel');
      if (panel) panel.style.display = 'none';
    },
  });
}
