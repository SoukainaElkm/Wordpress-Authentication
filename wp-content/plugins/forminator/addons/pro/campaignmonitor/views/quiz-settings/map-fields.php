<?php
// Defaults
$vars = array(
	'error_message' => '',
	'multi_id'      => '',
	'fields_map'    => array(),
	'fields'        => array(),
	'form_fields'   => array(),
	'quiz_fields'   => array(),
	'email_fields'  => array(),
);

/** @var array $template_vars */
foreach ( $template_vars as $key => $val ) {
	$vars[ $key ] = $val;
} ?>

<div class="integration-header">

    <h3 id="dialogTitle2" class="sui-box-title"><?php echo esc_html( __( 'Assign Fields', 'forminator' ) ); ?></h3>

    <span class="sui-description" style="margin-top: 20px;"><?php esc_html_e( "Match up your quiz lead fields with your Campaign Monitor fields to make sure we're sending data to the right place.", 'forminator' ); ?></span>

	<?php if ( ! empty( $vars['error_message'] ) ) : ?>
        <div class="sui-notice sui-notice-error">
            <p><?php echo esc_html( $vars['error_message'] ); ?></p>
        </div>
	<?php endif; ?>

</div>

<form>

    <table class="sui-table" style="margin-bottom: 0;">

        <thead>

        <tr>
            <th><?php esc_html_e( 'Campaign Monitor Field', 'forminator' ); ?></th>
            <th><?php esc_html_e( 'Forminator Field', 'forminator' ); ?></th>
        </tr>

        </thead>

        <tbody>

		<?php foreach ( $vars['fields'] as $key => $field_title ) : ?>

            <tr>

                <td>
					<?php echo esc_html( $field_title ); ?>
					<?php if ( 'default_field_email' === $key || 'default_field_name' === $key ) : ?>
                        <span class="integrations-required-field">*</span>
					<?php endif; ?>
                </td>

                <td>
					<?php
					$forminator_fields = $vars['form_fields'];
					if ( 'default_field_email' === $key ) {
						$forminator_fields = $vars['email_fields'];
					}
					$current_error    = '';
					$current_selected = '';
					if ( isset( $vars[ $key . '_error' ] ) && ! empty( $vars[ $key . '_error' ] ) ) {
						$current_error = $vars[ $key . '_error' ];
					}
					if ( isset( $vars['fields_map'][ $key ] ) && ! empty( $vars['fields_map'][ $key ] ) ) {
						$current_selected = $vars['fields_map'][ $key ];
					}
					?>
                    <div class="sui-form-field <?php echo esc_attr( ! empty( $current_error ) ? 'sui-form-field-error' : '' ); ?>">
                        <label>
                            <select class="sui-select" name="fields_map[<?php echo esc_attr( $key ); ?>]">
                                <option value=""><?php esc_html_e( 'None', 'forminator' ); ?></option>
								<?php foreach ( $forminator_fields as $forminator_field ) : ?>
                                    <option value="<?php echo esc_attr( $forminator_field['element_id'] ); ?>"
										<?php selected( $current_selected, $forminator_field['element_id'] ); ?>>
										<?php echo esc_html( $forminator_field['field_label'] . ' | ' . $forminator_field['element_id'] ); ?>
                                    </option>
								<?php endforeach;
								if ( 'default_field_email' !== $key ) {
									foreach ( $vars['quiz_fields'] as $quiz_key => $quiz_field ) : ?>
                                        <option value="<?php echo esc_attr( $quiz_key ); ?>"
											<?php selected( $current_selected, $quiz_key ); ?>>
											<?php echo esc_html( $quiz_field . ' | ' . $quiz_key ); ?>
                                        </option>
									<?php endforeach;
								} ?>
                            </select>
                        </label>
						<?php if ( ! empty( $current_error ) ) : ?>
                            <span class="sui-error-message"><?php echo esc_html( $current_error ); ?></span>
						<?php endif; ?>
                    </div>
                </td>

            </tr>

		<?php endforeach; ?>

        </tbody>

    </table>

    <input type="hidden" name="multi_id" value="<?php echo esc_attr( $vars['multi_id'] ); ?>">

</form>
