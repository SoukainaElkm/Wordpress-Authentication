<?php
$banner_1x = forminator_plugin_url() . 'assets/images/subscription-free.png';
$banner_2x = forminator_plugin_url() . 'assets/images/subscription-free@2x.png';
?>

<div
	id="forminator-new-feature"
	class="sui-dialog sui-dialog-onboard"
	aria-hidden="true"
>

	<div class="sui-dialog-overlay sui-fade-out" data-a11y-dialog-hide="forminator-new-feature" aria-hidden="true"></div>

	<div
		class="sui-dialog-content sui-fade-out"
		role="dialog"
	>

		<div class="sui-slider forminator-feature-modal" data-prop="forminator_dismiss_feature_1150" data-nonce="<?php echo esc_attr( wp_create_nonce( 'forminator_dismiss_notification' ) ); ?>">

			<ul role="document" class="sui-slider-content">

				<li class="sui-current sui-loaded" data-slide="1">

					<div class="sui-box">
                        <div class="sui-box-banner" role="banner" aria-hidden="true">
	                        <?php if ( FORMINATOR_PRO ) { ?>
                                <script src="https://fast.wistia.com/embed/medias/b7q3964j3b.jsonp" async></script>
                                <script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
                                <div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;">
                                    <div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">
                                        <span class="wistia_embed wistia_async_b7q3964j3b popover=true popoverAnimateThumbnail=true videoFoam=true" style="display:inline-block;height:100%;position:relative;width:100%">&nbsp;</span>
                                    </div>
                                </div>
	                        <?php } else { ?>
                                <img
                                    src="<?php echo esc_url( $banner_1x ); ?>"
                                    srcset="<?php echo esc_url( $banner_1x ); ?> 1x, <?php echo esc_url( $banner_2x ); ?> 2x"
                                    class="sui-image"
                                    alt="Forminator"
                                />
	                        <?php } ?>
                        </div>

						<div class="sui-box-header sui-block-content-center">

							<button data-a11y-dialog-hide="forminator-new-feature" class="sui-dialog-close forminator-dismiss-new-feature" aria-label="<?php esc_html_e( 'Close this dialog window', 'forminator' ); ?>"></button>

							<?php if ( FORMINATOR_PRO ) { ?>

								<h2 class="sui-box-title"><?php esc_html_e( 'New! Add-ons and Subscription Payments', 'forminator' ); ?></h2>

								<p class="sui-description"><?php esc_html_e( 'Start accepting recurring subscription payments on your WordPress sites with Forminator Pro. You can also now accept multiple payment methods in a single form and use conditional logic to process any payment field based on form data.', 'forminator' ); ?></p>

							<?php } else { ?>
                                <h2 class="sui-box-title"><?php esc_html_e( 'New! Conditional Payment', 'forminator' ); ?></h2>

                                <p class="sui-description"><?php esc_html_e( 'With this release, you can now accept both Stripe and PayPal payment in a single form. Simply add both Stripe and PayPal fields to your form, and use conditional logic to process either payment field based on form data. Or, let visitors skip payment altogether!', 'forminator' ); ?></p>
						 	<?php } ?>

						</div>

							<div class="sui-box-body" sui-spacing-bottom="0">

							</div>

							<div class="sui-box-footer sui-block-content-center">

								<button class="sui-button forminator-dismiss-new-feature" type="button" data-a11y-dialog-hide="forminator-new-feature"><?php esc_html_e( 'Got It', 'forminator' ); ?></button>

							</div>

					</div>

				</li>

			</ul>

		</div>

	</div>

</div>

<script type="text/javascript">
	jQuery( '#forminator-new-feature .forminator-dismiss-new-feature' ).on( 'click', function( e ) {
		e.preventDefault();

		var $notice = jQuery( e.currentTarget ).closest( '.forminator-feature-modal' );
		var ajaxUrl = '<?php echo forminator_ajax_url();// phpcs:ignore ?>';

		jQuery.post(
			ajaxUrl,
			{
				action: 'forminator_dismiss_notification',
				prop: $notice.data('prop'),
				_ajax_nonce: $notice.data('nonce')
			}
		).always( function() {
			$notice.hide();
		});
	});
</script>
