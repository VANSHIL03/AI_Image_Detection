# AuraLens AI: 50+ Comprehensive Viva Voce Questions & Answers

**Course**: B.Tech Computer Science & Engineering  
**Subject**: Major Project Defense / Viva Voce  
**Project**: AI-Generated Image & Video Detection Using Deep Learning, Machine Learning, and Digital Forensics

---

## SECTION 1: CORE DEEP LEARNING & COMPUTER VISION

### Q1: What is the primary architecture used in this project, and why was it selected over standard ResNet or VGG?
**Answer**:  
We employ **EfficientNet-B0** as our primary convolutional backbone. While ResNet and VGG arbitrarily scale either depth (number of layers) or width (channels), EfficientNet uses **compound scaling**, uniformly balancing network depth, width, and image resolution with a fixed compound coefficient $\phi$. This achieves higher Top-1 accuracy while requiring significantly fewer parameters (5.3M vs ResNet-50's 25.6M), allowing sub-250ms real-time inference on our NVIDIA RTX 4050 GPU.

### Q2: What is Transfer Learning, and why is it essential for synthetic media detection?
**Answer**:  
Transfer Learning leverages feature representations learned by a model pre-trained on a massive dataset (e.g., ImageNet with 1.2M images) and adapts them to a specialized downstream task. In synthetic media detection, lower layers extract fundamental visual primitives (edges, textures, lighting gradients), while our custom classification head is fine-tuned to recognize microscopic generative artifacts (e.g., diffusion noise residues, boundary blending errors).

### Q3: How do Diffusion Models generate images, and what artifacts do they leave behind?
**Answer**:  
Diffusion Models (e.g., Stable Diffusion, Midjourney) operate through a forward diffusion process (gradually adding Gaussian noise to an image) and a reverse denoising process (using a U-Net with cross-attention to iteratively subtract noise conditioned on text embeddings). Because of transposed convolutions and iterative latent upsampling, they leave:
1. High-frequency checkerboard grid patterns visible in 2D Fourier space.
2. Unnatural texture homogeneity on skin surfaces and flat backgrounds.
3. Chrominance cross-channel statistical mismatches.

### Q4: What is the difference between GANs and Diffusion Models?
**Answer**:  
- **GANs (Generative Adversarial Networks)**: Consist of two competing networks—a Generator creating synthetic images and a Discriminator attempting to differentiate real from fake in a minimax game. GANs often produce structural warping and color saturation anomalies.
- **Diffusion Models**: Formulate generation as a parameterized Markov chain that iteratively denoises a latent Gaussian distribution. They yield higher visual coherence and photorealism but exhibit spectral frequency grid drop-offs.

### Q5: Why do you apply Temperature Scaling to model logits?
**Answer**:  
Deep neural networks are often overconfident in their raw Softmax predictions. Temperature scaling divides raw logits $z$ by a learned scalar $T > 1$ before the Softmax function:
$$P_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$$
This softens the probability distribution without changing the argmax prediction order, producing well-calibrated probabilities that truthfully reflect real-world prediction confidence.

---

## SECTION 2: EXPLAINABLE AI (XAI) & GRAD-CAM

### Q6: What is Grad-CAM, and how does it mathematically work?
**Answer**:  
**Grad-CAM (Gradient-weighted Class Activation Mapping)** generates a visual explanation of the regions within an input image that influenced a CNN's classification score.
1. It computes the gradient of the target class logit $Y^c$ with respect to the activation maps $A^k$ of the final convolutional layer:
   $$\alpha_k^c = \frac{1}{Z} \sum_i \sum_j \frac{\partial Y^c}{\partial A_{i,j}^k}$$
2. The weights $\alpha_k^c$ represent channel importance. We compute a weighted sum of activation maps and apply ReLU:
   $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left( \sum_k \alpha_k^c A^k \right)$$
3. The resulting map is normalized and overlaid as a Jet colormap on the original image.

### Q7: Why is ReLU applied in Grad-CAM rather than using the raw weighted sum?
**Answer**:  
ReLU is applied to isolate features that have a **positive influence** on the target class of interest (i.e., pixels whose presence increases the synthetic score). Negative contributions (features that suggest the alternative class) are zeroed out to prevent visual noise.

### Q8: Why is the final convolutional layer selected for Grad-CAM rather than an early layer?
**Answer**:  
Convolutional layers preserve 2D spatial coordinates, unlike fully connected layers. The final convolutional layer possesses the highest-level semantic information and the largest receptive field, providing the optimal trade-off between spatial localization and semantic classification evidence.

---

## SECTION 3: DIGITAL FORENSICS & FREQUENCY ANALYSIS

### Q9: What is Error Level Analysis (ELA) and how does it detect manipulation?
**Answer**:  
ELA resaves the input image at a known lossy compression rate (e.g., JPEG quality 90) and computes the absolute difference between original and resaved pixel values. Because standard cameras compress an entire image uniformly, an unaltered photograph displays a uniform error distribution. Modified, spliced, or AI-generated sections display distinct error rates due to differing compression histories.

### Q10: How does 2D Fast Fourier Transform (FFT) reveal AI generation?
**Answer**:  
The 2D-FFT converts spatial pixel intensities into discrete frequency components. Natural optical camera sensors distribute high-frequency noise organically across the spectral plane. In contrast, generative upsamplers and latent diffusion decoders create periodic frequency grid spikes and anomalous high-frequency energy ratios that clearly stand out in the power spectrum.

### Q11: What is Laplacian Residual Noise Variance?
**Answer**:  
The Laplacian operator is a 2D isotropic measure of the 2nd spatial derivative of an image:
$$\nabla^2 f = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2}$$
Applying the Laplacian filter isolates micro-edge variance and optical sensor noise. AI-generated images frequently exhibit unnaturally low noise variance across flat regions (over-smoothing).

---

## SECTION 4: VIDEO FORENSICS & TEMPORAL CONSISTENCY

### Q12: Why is video deepfake detection more complex than single-image detection?
**Answer**:  
Videos introduce a temporal dimension ($T$). Individual frames in a deepfake video may appear plausible in isolation, but sequential playback reveals inter-frame jitter, blinking irregularities, lighting shifts, and face-boundary warping. Conversely, low video bitrates introduce compression artifacts that can falsely trigger image-level detectors.

### Q13: How does your system aggregate frame-level predictions into a video verdict?
**Answer**:  
We implement a hybrid temporal aggregation formula:
$$P_{\text{video}} = 0.45 \cdot \text{Median}(P) + 0.40 \cdot \text{Top-}K\text{ Mean}(P) + 0.15 \cdot (1.0 - \text{Consistency})$$
- **Median** ensures stability against isolated noisy frames.
- **Top-K Mean** captures localized, high-confidence deepfake segment injections.
- **Temporal Consistency** penalizes frame-to-frame probability fluctuations (jitter).

### Q14: What is the benefit of adaptive frame sampling over full-frame decoding?
**Answer**:  
Decoding every frame in a 60 FPS 4K video consumes prohibitive CPU/GPU cycles and creates memory bottlenecks. Sampling keyframes at 1.0–2.0 FPS captures sufficient temporal transitions while reducing processing time by over 90%, enabling real-time analysis on standard hardware.

---

## SECTION 5: FULL-STACK SOFTWARE ENGINEERING & DEPLOYMENT

### Q15: Why did you choose FastAPI over Flask or Django?
**Answer**:  
1. **Asynchronous Concurrency**: Built on Starlette and ASGI, FastAPI handles concurrent non-blocking I/O operations seamlessly.
2. **Data Validation**: Native Pydantic v2 integration provides automatic request/response schema parsing and security sanitization.
3. **Speed**: Benchmarks show FastAPI is significantly faster than Flask and comparable to Go/Node.js.
4. **Auto-Documentation**: Generates interactive OpenAPI (Swagger) specifications automatically.

### Q16: How do you handle temporary media uploads securely?
**Answer**:  
Uploaded files are validated using magic byte headers (preventing executable disguise attacks) and stored in isolated temporary buffers. A background asyncio worker continuously scans the upload cache and removes files older than 30 minutes, ensuring user privacy and disk storage integrity.

### Q17: How is the React frontend structured for high performance?
**Answer**:  
Built with **Vite** for sub-second hot-module replacement and optimized Rollup bundling. It uses modular component hierarchy, Context API for zero-lag dark/light mode toggling, Recharts for responsive SVG visualization, and async Axios clients with progress indicators.

---

## SECTION 6: EVALUATION METRICS & EDGE CASES

### Q18: What is the difference between Precision and Recall in this context?
**Answer**:  
- **Precision**: Of all media flagged as AI-generated, how many were actually synthetic? High precision prevents falsely accusing innocent authentic content.
- **Recall**: Of all actual synthetic files, how many did the system catch? High recall ensures dangerous deepfakes do not slip through undetected.

### Q19: What causes "Uncertain" predictions, and why is an uncertainty category necessary?
**Answer**:  
Predictions falling between 35% and 65% calibrated probability are designated "Uncertain." This occurs when media has undergone heavy social media compression (e.g. WhatsApp, Instagram) or artistic filtering that degrades forensic signals. Forcing a binary verdict would produce unacceptable false-positive rates.

### Q20: What are the main real-world limitations of synthetic media detection?
**Answer**:  
1. **Compression degradation**: Re-encoding removes high-frequency Fourier signatures.
2. **Adversarial perturbation**: Deliberately injected imperceptible noise can fool neural networks.
3. **Generator drift**: Novel architectures (e.g. future diffusion transformers) may exhibit unseen artifact patterns requiring continual retraining.
