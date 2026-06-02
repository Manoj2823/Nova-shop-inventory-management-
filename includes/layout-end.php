            </main>
        </div>
    </div>

    <div class="modal-overlay" id="modalOverlay" hidden>
        <div class="modal card-3d" id="modal" role="dialog" aria-modal="true">
            <div class="modal-header">
                <h2 id="modalTitle">Form</h2>
                <button type="button" class="modal-close" id="modalClose" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body" id="modalBody"></div>
        </div>
    </div>

    <script>window.APP_BASE = <?= json_encode(url()) ?>;</script>
    <script src="<?= assetVersion('js/app.js') ?>"></script>
    <script src="<?= assetVersion('js/alerts.js') ?>"></script>
    <?php if (!empty($pageScript)): ?>
    <script src="<?= assetVersion('js/' . $pageScript) ?>"></script>
    <?php endif; ?>
</body>
</html>
